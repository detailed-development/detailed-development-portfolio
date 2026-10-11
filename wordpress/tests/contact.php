<?php
/** Dependency-free contract checks; WordPress integration is verified on the host. */
define( 'ABSPATH', __DIR__ );
define( 'MINUTE_IN_SECONDS', 60 );

$hooks = $routes = $types = $posts = $transients = array();
$options = array( 'dd_portfolio_origins' => 'http://127.0.0.1:5173' );
$mail_result = true;
$mail_calls = 0;
$save_fails = false;
$_SERVER['REMOTE_ADDR'] = '192.0.2.1';

class WP_Error {
	public function __construct( public $code, public $message, public $data = array() ) {}
}
class WP_REST_Response {
	public $headers = array();
	public function __construct( public $data, public $status = 200 ) {}
	public function header( $key, $value ) { $this->headers[ $key ] = $value; }
}
class ContactTestRequest {
	public function __construct( public $params, public $origin = 'http://127.0.0.1:5173' ) {}
	public function get_param( $key ) { return $this->params[ $key ] ?? null; }
	public function get_header( $key ) { return 'origin' === $key ? $this->origin : ''; }
	public function get_route() { return '/dd/v1/contact'; }
}
function add_action( $name, $callback, ...$args ) { $GLOBALS['hooks'][ $name ][] = $callback; }
function add_filter( $name, $callback, ...$args ) { add_action( $name, $callback ); }
function remove_filter( ...$args ) {}
function register_activation_hook( ...$args ) {}
function register_deactivation_hook( ...$args ) {}
function register_post_type( $name, $args ) { $GLOBALS['types'][ $name ] = $args; }
function register_rest_route( $namespace, $route, $args ) { $GLOBALS['routes'][ $namespace . $route ] = $args; }
function __( $text, ...$args ) { return $text; }
function get_option( $key, $default = false ) { return $GLOBALS['options'][ $key ] ?? $default; }
function get_transient( $key ) { return $GLOBALS['transients'][ $key ] ?? false; }
function set_transient( $key, $value, $ttl ) { $GLOBALS['transients'][ $key ] = $value; }
function wp_salt( $scheme ) { return 'test-only-salt'; }
function home_url() { return 'https://admin.example.test/wordpress'; }
function admin_url( $path ) { return 'https://admin.example.test/wp-admin/' . $path; }
function wp_parse_url( $url ) { return parse_url( $url ); }
function untrailingslashit( $text ) { return rtrim( $text, '/' ); }
function is_email( $value ) { return filter_var( $value, FILTER_VALIDATE_EMAIL ); }
function wp_is_uuid( $value, $version ) { return 1 === preg_match( '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value ); }
function sanitize_text_field( $text ) { return trim( preg_replace( '/[\r\n\t]+/', ' ', strip_tags( $text ) ) ); }
function sanitize_textarea_field( $text ) { return trim( strip_tags( $text ) ); }
function sanitize_email( $email ) { return filter_var( $email, FILTER_SANITIZE_EMAIL ); }
function wp_slash( $value ) { return is_array( $value ) ? array_map( 'wp_slash', $value ) : addslashes( (string) $value ); }
function wp_unslash( $value ) { return is_array( $value ) ? array_map( 'wp_unslash', $value ) : stripslashes( (string) $value ); }
function is_wp_error( $value ) { return $value instanceof WP_Error; }
function wp_insert_post( $post, $return_error ) {
	if ( $GLOBALS['save_fails'] ) return new WP_Error( 'db_error', 'Database unavailable' );
	$id = count( $GLOBALS['posts'] ) + 1;
	$GLOBALS['posts'][ $id ] = wp_unslash( $post );
	return $id;
}
function get_posts( $args ) {
	return array_keys( array_filter( $GLOBALS['posts'], function ( $post ) use ( $args ) {
		return $post['post_type'] === $args['post_type'] && $post['post_status'] === $args['post_status'] && $post['meta_input'][ $args['meta_key'] ] === $args['meta_value'];
	} ) );
}
function update_post_meta( $id, $key, $value ) { $GLOBALS['posts'][ $id ]['meta_input'][ $key ] = $value; }
function get_post_meta( $id, $key, $single ) { return $GLOBALS['posts'][ $id ]['meta_input'][ $key ] ?? ''; }
function wp_mail( $to, $subject, $body, $headers ) {
	++$GLOBALS['mail_calls'];
	$GLOBALS['last_mail'] = compact( 'to', 'subject', 'body', 'headers' );
	if ( 'throw' === $GLOBALS['mail_result'] ) throw new RuntimeException( 'Broken transport' );
	return $GLOBALS['mail_result'];
}

require dirname( __DIR__ ) . '/dd-portfolio-cms/dd-portfolio-cms.php';
dd_portfolio_register_contact_inbox();
foreach ( $hooks['rest_api_init'] as $callback ) $callback();
$route = $routes['dd/v1/contact'];
$checks = 0;
function check( $condition, $label ) {
	if ( ! $condition ) { fwrite( STDERR, "FAIL: {$label}\n" ); exit( 1 ); }
	++$GLOBALS['checks'];
}
function payload( $number, $overrides = array() ) {
	return array_merge( array(
		'name' => "O'Connor", 'email' => 'visitor@example.test', 'message' => "Let's build something.\nSecond line.",
		'website' => '', 'request_id' => sprintf( '00000000-0000-4000-8000-%012d', $number ),
	), $overrides );
}
function submit( $params, $origin = 'http://127.0.0.1:5173' ) {
	$route = $GLOBALS['route'];
	foreach ( $route['args'] as $key => $schema ) {
		if ( ! array_key_exists( $key, $params ) ) {
			if ( ! empty( $schema['required'] ) ) return new WP_Error( 'missing', 'Missing input', array( 'status' => 400 ) );
			$params[ $key ] = $schema['default'];
		}
		if ( ! $schema['validate_callback']( $params[ $key ], null, $key ) ) return new WP_Error( 'invalid', 'Invalid input', array( 'status' => 400 ) );
	}
	$request = new ContactTestRequest( $params, $origin );
	$allowed = $route['permission_callback']( $request );
	return true === $allowed ? $route['callback']( $request ) : $allowed;
}

check( 'POST' === $route['methods'], 'Submission endpoint exposes no GET/read method' );
$type = $types['dd_contact_request'];
check( false === $type['public'] && false === $type['show_in_rest'] && false === $type['publicly_queryable'], 'Inbox is private, without public routes' );
check( 'manage_options' === $type['capabilities']['read_post'] && 'do_not_allow' === $type['capabilities']['create_posts'], 'Inbox requires administrator capability' );
check( 403 === submit( payload( 1 ), 'https://other.example.test' )->data['status'], 'Unlisted browser origin rejected' );
check( 403 === submit( payload( 1 ), '' )->data['status'], 'Missing browser origin rejected' );
check( true === dd_portfolio_contact_permission( new ContactTestRequest( payload( 1 ), 'https://admin.example.test' ) ), 'CMS origin handles WordPress installed in a subdirectory' );
foreach ( array( array( 'email' => "x@example.test\r\nBcc: other@example.test" ), array( 'email' => 'bad' ), array( 'message' => array() ), array( 'message' => str_repeat( 'a', 5001 ) ), array( 'name' => str_repeat( 'a', 101 ) ), array( 'request_id' => 'not-a-uuid' ) ) as $invalid ) {
	check( 400 === submit( payload( 1, $invalid ) )->data['status'], 'Malformed or oversized input rejected' );
}
check( 400 === submit( payload( 1, array( 'message' => " \n " ) ) )->data['status'], 'Whitespace-only message rejected' );
check( true === submit( payload( 1, array( 'website' => 'spam.test' ) ) )->data['saved'] && 0 === count( $posts ) && 0 === $mail_calls, 'Honeypot creates no record or email' );

$result = submit( payload( 1 ) );
check( 201 === $result->status && true === $result->data['saved'], 'Success returned after durable storage' );
check( 'private' === $posts[1]['post_status'] && payload( 1 )['message'] === $posts[1]['post_content'] && "O'Connor" === $posts[1]['meta_input']['dd_contact_name'], 'Private storage preserves apostrophes and line breaks' );
check( 'accepted' === $posts[1]['meta_input']['dd_notification_status'] && 1 === $mail_calls && 'anthony@detailed-development.com' === $last_mail['to'], 'Notification sent to configured owner only' );
check( in_array( 'Reply-To: visitor@example.test', $last_mail['headers'], true ), 'Visitor used as Reply-To, without spoofing From' );
check( 200 === submit( payload( 1 ) )->status && 1 === count( $posts ) && 1 === $mail_calls, 'Retry does not duplicate saved request or mail' );

$mail_result = false;
check( 201 === submit( payload( 2 ) )->status && 'failed' === $posts[2]['meta_input']['dd_notification_status'], 'Mail failure preserves saved request and success response' );
$mail_result = 'throw';
check( 201 === submit( payload( 3 ) )->status && 'failed' === $posts[3]['meta_input']['dd_notification_status'], 'Mail exception preserves saved request' );
$options['dd_portfolio_contact_notifications'] = false;
$mail_before = $mail_calls;
check( 201 === submit( payload( 4 ) )->status && 'disabled' === $posts[4]['meta_input']['dd_notification_status'] && $mail_calls === $mail_before, 'Inbox works with notifications disabled' );

$save_fails = true;
check( 503 === submit( payload( 5 ) )->data['status'] && 4 === count( $posts ) && $mail_calls === $mail_before, 'Storage failure never reports success or sends mail' );
$save_fails = false;
$limited = submit( payload( 6 ) );
check( 429 === $limited->status && isset( $limited->headers['Retry-After'] ), 'Rate limit rejects excess attempts' );
check( 200 === submit( payload( 1 ) )->status, 'Known saved request can be confirmed despite rate limit' );
check( ! str_contains( json_encode( $transients ), $_SERVER['REMOTE_ADDR'] ), 'Rate limiter does not retain raw IP address' );

$_SERVER['REMOTE_ADDR'] = '192.0.2.2';
$optional = payload( 7 );
unset( $optional['name'], $optional['website'] );
check( 201 === submit( $optional )->status, 'Optional fields can be omitted' );
$response = new WP_REST_Response( array( 'saved' => true ) );
foreach ( $hooks['rest_post_dispatch'] as $callback ) $callback( $response, null, new ContactTestRequest( payload( 7 ) ) );
check( 'no-store' === $response->headers['Cache-Control'], 'Contact responses cannot be cached' );

echo "Passed {$checks} contact contract checks.\n";
