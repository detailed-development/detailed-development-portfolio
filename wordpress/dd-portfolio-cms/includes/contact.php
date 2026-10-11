<?php
/** Private contact inbox and public, write-only submission endpoint. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'dd_portfolio_register_contact_inbox' );
function dd_portfolio_register_contact_inbox() {
	register_post_type( 'dd_contact_request', array(
		'labels' => array(
			'name'          => __( 'Contact Requests', 'dd-portfolio-cms' ),
			'singular_name' => __( 'Contact Request', 'dd-portfolio-cms' ),
			'edit_item'     => __( 'Read Contact Request', 'dd-portfolio-cms' ),
			'not_found'     => __( 'No contact requests yet.', 'dd-portfolio-cms' ),
			'search_items'  => __( 'Search Contact Requests', 'dd-portfolio-cms' ),
		),
		'public'             => false,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'show_ui'            => true,
		'show_in_menu'       => 'edit.php?post_type=dd_project',
		'show_in_rest'       => false,
		'has_archive'        => false,
		'rewrite'            => false,
		'query_var'          => false,
		'supports'           => false,
		'map_meta_cap'       => false,
		'capabilities'       => array(
			'edit_post'              => 'manage_options',
			'read_post'              => 'manage_options',
			'delete_post'            => 'manage_options',
			'edit_posts'             => 'manage_options',
			'edit_others_posts'      => 'manage_options',
			'publish_posts'          => 'manage_options',
			'read_private_posts'     => 'manage_options',
			'delete_posts'           => 'manage_options',
			'delete_private_posts'   => 'manage_options',
			'delete_published_posts' => 'manage_options',
			'delete_others_posts'    => 'manage_options',
			'edit_private_posts'     => 'manage_options',
			'edit_published_posts'   => 'manage_options',
			'create_posts'           => 'do_not_allow',
		),
	) );
}

add_filter( 'manage_dd_contact_request_posts_columns', function () {
	return array(
		'cb'              => '<input type="checkbox" />',
		'title'           => __( 'From', 'dd-portfolio-cms' ),
		'dd_email'        => __( 'Email', 'dd-portfolio-cms' ),
		'dd_read'         => __( 'Inbox', 'dd-portfolio-cms' ),
		'dd_notification' => __( 'Email notification', 'dd-portfolio-cms' ),
		'date'            => __( 'Received', 'dd-portfolio-cms' ),
	);
} );

function dd_portfolio_contact_mail_label( $post_id ) {
	$status = get_post_meta( $post_id, 'dd_notification_status', true );
	$labels = array(
		'accepted' => __( 'Accepted by mail transport (delivery unconfirmed)', 'dd-portfolio-cms' ),
		'failed'   => __( 'Mail attempt failed; request saved here', 'dd-portfolio-cms' ),
		'disabled' => __( 'Notifications off', 'dd-portfolio-cms' ),
	);
	return isset( $labels[ $status ] ) ? $labels[ $status ] : __( 'Pending', 'dd-portfolio-cms' );
}

add_action( 'manage_dd_contact_request_posts_custom_column', function ( $column, $post_id ) {
	if ( 'dd_email' === $column ) {
		echo esc_html( get_post_meta( $post_id, 'dd_contact_email', true ) );
	} elseif ( 'dd_read' === $column ) {
		echo get_post_meta( $post_id, 'dd_contact_read', true ) ? esc_html__( 'Read', 'dd-portfolio-cms' ) : '<strong>' . esc_html__( 'New', 'dd-portfolio-cms' ) . '</strong>';
	} elseif ( 'dd_notification' === $column ) {
		echo esc_html( dd_portfolio_contact_mail_label( $post_id ) );
	}
}, 10, 2 );

add_filter( 'post_row_actions', function ( $actions, $post ) {
	if ( 'dd_contact_request' === $post->post_type ) {
		unset( $actions['inline hide-if-no-js'], $actions['view'] );
	}
	return $actions;
}, 10, 2 );

add_filter( 'bulk_actions-edit-dd_contact_request', function ( $actions ) {
	unset( $actions['edit'] );
	return $actions;
} );

add_action( 'load-post.php', function () {
	$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
	if ( $post_id && 'dd_contact_request' === get_post_type( $post_id ) && current_user_can( 'manage_options' ) ) {
		update_post_meta( $post_id, 'dd_contact_read', 1 );
	}
} );

add_action( 'add_meta_boxes_dd_contact_request', function () {
	remove_meta_box( 'submitdiv', 'dd_contact_request', 'side' );
	add_meta_box( 'dd_contact_details', __( 'Request', 'dd-portfolio-cms' ), 'dd_portfolio_render_contact_request', 'dd_contact_request', 'normal', 'high' );
} );

function dd_portfolio_render_contact_request( $post ) {
	$email = get_post_meta( $post->ID, 'dd_contact_email', true );
	?>
	<p><strong><?php esc_html_e( 'From:', 'dd-portfolio-cms' ); ?></strong> <?php echo esc_html( get_post_meta( $post->ID, 'dd_contact_name', true ) ?: __( 'Name not provided', 'dd-portfolio-cms' ) ); ?></p>
	<p><strong><?php esc_html_e( 'Email:', 'dd-portfolio-cms' ); ?></strong> <a href="<?php echo esc_attr( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a></p>
	<p><strong><?php esc_html_e( 'Notification:', 'dd-portfolio-cms' ); ?></strong> <?php echo esc_html( dd_portfolio_contact_mail_label( $post->ID ) ); ?></p>
	<hr>
	<div style="white-space:pre-wrap;overflow-wrap:anywhere"><?php echo esc_html( $post->post_content ); ?></div>
	<?php
}

function dd_portfolio_contact_permission( $request ) {
	$origin  = untrailingslashit( $request->get_header( 'origin' ) );
	$allowed = array_filter( array_map( 'trim', preg_split( '/[\r\n,]+/', (string) get_option( 'dd_portfolio_origins', '' ) ) ) );
	$allowed = array_map( 'untrailingslashit', $allowed );
	// Browser origin checks reduce drive-by submissions; this is still a public endpoint.
	if ( $origin && ( $origin === untrailingslashit( dd_portfolio_url_origin( home_url() ) ) || in_array( '*', $allowed, true ) || in_array( $origin, $allowed, true ) ) ) {
		return true;
	}
	return new WP_Error( 'dd_contact_origin', __( 'This site is not allowed to submit requests.', 'dd-portfolio-cms' ), array( 'status' => 403 ) );
}

/** Return only the origin of a configured URL, including any port. */
function dd_portfolio_url_origin( $url ) {
	$parts = wp_parse_url( $url );
	return $parts['scheme'] . '://' . $parts['host'] . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
}

function dd_portfolio_contact_validate_text( $value, $request, $param ) {
	$limits = array( 'name' => 100, 'message' => 5000, 'website' => 500 );
	return is_string( $value ) && ( function_exists( 'mb_strlen' ) ? mb_strlen( $value ) : strlen( $value ) ) <= $limits[ $param ];
}

add_action( 'rest_api_init', function () {
	register_rest_route( DD_PORTFOLIO_CMS_REST_NS, '/contact', array(
		'methods'             => 'POST',
		'callback'            => 'dd_portfolio_rest_contact',
		'permission_callback' => 'dd_portfolio_contact_permission',
		'args'               => array(
			'name'       => array( 'default' => '', 'validate_callback' => 'dd_portfolio_contact_validate_text' ),
			'email'      => array( 'required' => true, 'validate_callback' => function ( $value ) { return is_string( $value ) && strlen( $value ) <= 254 && is_email( trim( $value ) ); } ),
			'message'    => array( 'required' => true, 'validate_callback' => 'dd_portfolio_contact_validate_text' ),
			'website'    => array( 'default' => '', 'validate_callback' => 'dd_portfolio_contact_validate_text' ),
			'request_id' => array( 'required' => true, 'validate_callback' => function ( $value ) { return is_string( $value ) && wp_is_uuid( $value, 4 ); } ),
		),
	) );
} );

add_filter( 'rest_post_dispatch', function ( $response, $server, $request ) {
	if ( '/' . DD_PORTFOLIO_CMS_REST_NS . '/contact' === $request->get_route() ) {
		$response->header( 'Cache-Control', 'no-store' );
	}
	return $response;
}, 10, 3 );

function dd_portfolio_rest_contact( $request ) {
	if ( '' !== trim( $request->get_param( 'website' ) ) ) {
		return new WP_REST_Response( array( 'saved' => true ), 200 ); // Quietly discard honeypot spam.
	}
	$name    = sanitize_text_field( $request->get_param( 'name' ) );
	$email   = sanitize_email( trim( $request->get_param( 'email' ) ) );
	$message = trim( sanitize_textarea_field( $request->get_param( 'message' ) ) );
	$token   = strtolower( $request->get_param( 'request_id' ) );
	if ( '' === $message ) {
		return new WP_Error( 'dd_contact_message', __( 'Please write a message.', 'dd-portfolio-cms' ), array( 'status' => 400 ) );
	}

	// A retry after a slow/lost response must not create a second request or email.
	$existing = get_posts( array(
		'post_type' => 'dd_contact_request', 'post_status' => 'private', 'fields' => 'ids',
		'posts_per_page' => 1, 'meta_key' => 'dd_contact_token', 'meta_value' => $token,
	) );
	if ( $existing ) {
		return new WP_REST_Response( array( 'saved' => true ), 200 );
	}

	// Keep only a short-lived salted hash of the remote IP, never the raw IP.
	$ip       = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
	$rate_key = 'dd_contact_rate_' . hash_hmac( 'sha256', $ip, wp_salt( 'auth' ) );
	$rate     = get_transient( $rate_key );
	$now      = time();
	if ( ! is_array( $rate ) || $rate['until'] <= $now ) {
		$rate = array( 'count' => 0, 'until' => $now + 15 * MINUTE_IN_SECONDS );
	}
	if ( $rate['count'] >= 5 ) {
		$response = new WP_REST_Response( array( 'code' => 'dd_contact_rate_limit', 'message' => __( 'Too many requests. Please try again later.', 'dd-portfolio-cms' ) ), 429 );
		$response->header( 'Retry-After', (string) ( $rate['until'] - $now ) );
		return $response;
	}
	++$rate['count'];
	set_transient( $rate_key, $rate, $rate['until'] - $now );

	$post_id = wp_insert_post( wp_slash( array(
		'post_type'    => 'dd_contact_request',
		'post_status'  => 'private',
		'post_title'   => $name ?: $email,
		'post_content' => $message,
		'meta_input'   => array(
			'dd_contact_name'  => $name,
			'dd_contact_email' => $email,
			'dd_contact_token' => $token,
			'dd_contact_read'  => 0,
		),
	) ), true );
	if ( is_wp_error( $post_id ) || ! $post_id ) {
		return new WP_Error( 'dd_contact_save_failed', __( 'We could not save your message. Please try again.', 'dd-portfolio-cms' ), array( 'status' => 503 ) );
	}

	// Storage is the source of truth. Mail failure must never undo a saved request.
	$notification = 'disabled';
	if ( get_option( 'dd_portfolio_contact_notifications', true ) ) {
		$notification = 'failed';
		try {
			$mail_ok = wp_mail(
				'anthony@detailed-development.com',
				'New website contact request',
				"Name: " . ( $name ?: 'Not provided' ) . "\nEmail: {$email}\n\n{$message}\n\nRead in your inbox:\n" . admin_url( 'post.php?post=' . $post_id . '&action=edit' ),
				array( 'Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email )
			);
			$notification = $mail_ok ? 'accepted' : 'failed';
		} catch ( Throwable $error ) {
			// A broken mail transport/plugin still must not break contact storage.
		}
	}
	update_post_meta( $post_id, 'dd_notification_status', $notification );
	return new WP_REST_Response( array( 'saved' => true ), 201 );
}
