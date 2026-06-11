<?php
/**
 * Plugin Name:       DD Portfolio CMS
 * Plugin URI:        https://github.com/detailed-development/detailed-development-portfolio
 * Description:        Headless CMS for the Detailed Development portfolio. Adds a "Projects" post type with all the fields the React site needs and exposes them at /wp-json/dd/v1/projects. Use this on a subdomain (e.g. cms.yourdomain.com) and point the React app at it.
 * Version:           1.0.0
 * Author:            Detailed Development LLC
 * License:           GPL-2.0-or-later
 * Text Domain:       dd-portfolio-cms
 *
 * How it works:
 *   - Add / edit / reorder projects in wp-admin under "Projects".
 *   - Publish = visible on the site. Draft (or Pending/Private) = hidden.
 *   - The Featured Image is the project photo. No photo? The site falls back to a letter tile.
 *   - The React site fetches the published projects from /wp-json/dd/v1/projects at runtime.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'DD_PORTFOLIO_CMS_VERSION', '1.0.0' );
define( 'DD_PORTFOLIO_CMS_REST_NS', 'dd/v1' );

/**
 * The meta fields stored on each project. Key => admin label.
 * Single-line text unless noted in the field renderer below.
 */
function dd_portfolio_fields() {
	return array(
		'dd_group'       => __( 'Group', 'dd-portfolio-cms' ),       // client | product
		'dd_industry'    => __( 'Industry / Type', 'dd-portfolio-cms' ),
		'dd_stack'       => __( 'Tech stack', 'dd-portfolio-cms' ),   // comma separated -> array
		'dd_summary'     => __( 'Summary', 'dd-portfolio-cms' ),      // short card blurb
		'dd_bullets'     => __( 'Highlights', 'dd-portfolio-cms' ),   // one per line -> array
		'dd_description' => __( 'Full description', 'dd-portfolio-cms' ), // detail-page copy
		'dd_url'         => __( 'Link', 'dd-portfolio-cms' ),         // live site (client) or repo (product)
	);
}

/* -------------------------------------------------------------------------
 * 1. Register the "Project" post type
 * ---------------------------------------------------------------------- */

add_action( 'init', 'dd_portfolio_register_cpt' );
function dd_portfolio_register_cpt() {
	$labels = array(
		'name'               => __( 'Projects', 'dd-portfolio-cms' ),
		'singular_name'      => __( 'Project', 'dd-portfolio-cms' ),
		'add_new'            => __( 'Add Project', 'dd-portfolio-cms' ),
		'add_new_item'       => __( 'Add New Project', 'dd-portfolio-cms' ),
		'edit_item'          => __( 'Edit Project', 'dd-portfolio-cms' ),
		'new_item'           => __( 'New Project', 'dd-portfolio-cms' ),
		'view_item'          => __( 'View Project', 'dd-portfolio-cms' ),
		'search_items'       => __( 'Search Projects', 'dd-portfolio-cms' ),
		'not_found'          => __( 'No projects yet', 'dd-portfolio-cms' ),
		'menu_name'          => __( 'Projects', 'dd-portfolio-cms' ),
		'all_items'          => __( 'All Projects', 'dd-portfolio-cms' ),
	);

	register_post_type(
		'dd_project',
		array(
			'labels'        => $labels,
			'public'        => false,        // not a front-end WP site; headless only
			'show_ui'       => true,         // ...but fully editable in wp-admin
			'show_in_menu'  => true,
			'menu_icon'     => 'dashicons-portfolio',
			'menu_position' => 22,
			'supports'      => array( 'title', 'thumbnail', 'page-attributes' ), // page-attributes = drag/Order field
			'show_in_rest'  => true,         // enables the block editor for the title; our data is served via a custom route
			'has_archive'   => false,
			'rewrite'       => false,
		)
	);
}

// "Featured image" needs theme support; headless installs may not declare it.
add_action( 'after_setup_theme', function () {
	add_theme_support( 'post-thumbnails', array( 'dd_project' ) );
} );

/* -------------------------------------------------------------------------
 * 2. Editing UI in wp-admin (meta box)
 * ---------------------------------------------------------------------- */

add_action( 'add_meta_boxes', 'dd_portfolio_add_meta_box' );
function dd_portfolio_add_meta_box() {
	add_meta_box(
		'dd_portfolio_details',
		__( 'Project Details', 'dd-portfolio-cms' ),
		'dd_portfolio_render_meta_box',
		'dd_project',
		'normal',
		'high'
	);
}

function dd_portfolio_render_meta_box( $post ) {
	wp_nonce_field( 'dd_portfolio_save', 'dd_portfolio_nonce' );

	$group       = get_post_meta( $post->ID, 'dd_group', true ) ?: 'client';
	$industry    = get_post_meta( $post->ID, 'dd_industry', true );
	$stack       = get_post_meta( $post->ID, 'dd_stack', true );
	$summary     = get_post_meta( $post->ID, 'dd_summary', true );
	$bullets     = get_post_meta( $post->ID, 'dd_bullets', true );
	$description  = get_post_meta( $post->ID, 'dd_description', true );
	$url         = get_post_meta( $post->ID, 'dd_url', true );
	?>
	<style>
		.dd-field{margin:0 0 18px}
		.dd-field label{display:block;font-weight:600;margin-bottom:5px}
		.dd-field .desc{color:#666;font-weight:400;font-size:12px;margin:2px 0 6px}
		.dd-field input[type=text],.dd-field input[type=url],.dd-field textarea,.dd-field select{width:100%;max-width:680px}
		.dd-field textarea{min-height:90px}
	</style>

	<div class="dd-field">
		<label for="dd_group"><?php esc_html_e( 'Group', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'Client Websites show on the work grid with a detail page. Products & Internal Tools show as compact cards that link out.', 'dd-portfolio-cms' ); ?></p>
		<select name="dd_group" id="dd_group">
			<option value="client" <?php selected( $group, 'client' ); ?>><?php esc_html_e( 'Client Website', 'dd-portfolio-cms' ); ?></option>
			<option value="product" <?php selected( $group, 'product' ); ?>><?php esc_html_e( 'Product / Internal Tool', 'dd-portfolio-cms' ); ?></option>
		</select>
	</div>

	<div class="dd-field">
		<label for="dd_industry"><?php esc_html_e( 'Industry / Type', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'e.g. "Church / Community" or "WordPress Plugin".', 'dd-portfolio-cms' ); ?></p>
		<input type="text" name="dd_industry" id="dd_industry" value="<?php echo esc_attr( $industry ); ?>" />
	</div>

	<div class="dd-field">
		<label for="dd_stack"><?php esc_html_e( 'Tech stack', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'Comma separated, e.g. WordPress, Astra, Elementor.', 'dd-portfolio-cms' ); ?></p>
		<input type="text" name="dd_stack" id="dd_stack" value="<?php echo esc_attr( $stack ); ?>" />
	</div>

	<div class="dd-field">
		<label for="dd_summary"><?php esc_html_e( 'Summary', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'Short blurb shown on the card.', 'dd-portfolio-cms' ); ?></p>
		<textarea name="dd_summary" id="dd_summary"><?php echo esc_textarea( $summary ); ?></textarea>
	</div>

	<div class="dd-field">
		<label for="dd_bullets"><?php esc_html_e( 'Highlights', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'One per line. Shown on client cards and detail pages. (Ignored for Products.)', 'dd-portfolio-cms' ); ?></p>
		<textarea name="dd_bullets" id="dd_bullets"><?php echo esc_textarea( $bullets ); ?></textarea>
	</div>

	<div class="dd-field">
		<label for="dd_description"><?php esc_html_e( 'Full description', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'Longer "What we built" copy on the detail page. (Client websites only.)', 'dd-portfolio-cms' ); ?></p>
		<textarea name="dd_description" id="dd_description"><?php echo esc_textarea( $description ); ?></textarea>
	</div>

	<div class="dd-field">
		<label for="dd_url"><?php esc_html_e( 'Link', 'dd-portfolio-cms' ); ?></label>
		<p class="desc"><?php esc_html_e( 'Live site URL (client) or repository URL (product). Leave blank for a product to show "Private Repository".', 'dd-portfolio-cms' ); ?></p>
		<input type="url" name="dd_url" id="dd_url" value="<?php echo esc_attr( $url ); ?>" placeholder="https://" />
	</div>

	<p class="desc" style="margin-top:6px">
		<strong><?php esc_html_e( 'Photo:', 'dd-portfolio-cms' ); ?></strong>
		<?php esc_html_e( 'Set the Featured Image (right sidebar) to give the project a photo. No image falls back to a letter tile.', 'dd-portfolio-cms' ); ?>
		<br>
		<strong><?php esc_html_e( 'Hide a project:', 'dd-portfolio-cms' ); ?></strong>
		<?php esc_html_e( 'Switch its status to Draft. Only Published projects appear on the site.', 'dd-portfolio-cms' ); ?>
		<br>
		<strong><?php esc_html_e( 'Order:', 'dd-portfolio-cms' ); ?></strong>
		<?php esc_html_e( 'Use the "Order" field in Page Attributes (lower = first). Ties break by newest first.', 'dd-portfolio-cms' ); ?>
	</p>
	<?php
}

add_action( 'save_post_dd_project', 'dd_portfolio_save_meta', 10, 2 );
function dd_portfolio_save_meta( $post_id, $post ) {
	// Guard: nonce, autosave, capability.
	if ( ! isset( $_POST['dd_portfolio_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['dd_portfolio_nonce'] ), 'dd_portfolio_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Group: whitelist.
	$group = isset( $_POST['dd_group'] ) && 'product' === $_POST['dd_group'] ? 'product' : 'client';
	update_post_meta( $post_id, 'dd_group', $group );

	// Single-line text fields.
	foreach ( array( 'dd_industry', 'dd_stack' ) as $key ) {
		$val = isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
		update_post_meta( $post_id, $key, $val );
	}

	// URL.
	$url = isset( $_POST['dd_url'] ) ? esc_url_raw( wp_unslash( $_POST['dd_url'] ) ) : '';
	update_post_meta( $post_id, 'dd_url', $url );

	// Multi-line text fields (preserve line breaks).
	foreach ( array( 'dd_summary', 'dd_bullets', 'dd_description' ) as $key ) {
		$val = isset( $_POST[ $key ] ) ? sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) : '';
		update_post_meta( $post_id, $key, $val );
	}
}

/* -------------------------------------------------------------------------
 * 3. Admin list columns (group + photo at a glance)
 * ---------------------------------------------------------------------- */

add_filter( 'manage_dd_project_posts_columns', function ( $cols ) {
	$new = array();
	foreach ( $cols as $key => $label ) {
		if ( 'title' === $key ) {
			$new['dd_photo'] = __( 'Photo', 'dd-portfolio-cms' );
		}
		$new[ $key ] = $label;
		if ( 'title' === $key ) {
			$new['dd_group_col'] = __( 'Group', 'dd-portfolio-cms' );
		}
	}
	return $new;
} );

add_action( 'manage_dd_project_posts_custom_column', function ( $col, $post_id ) {
	if ( 'dd_photo' === $col ) {
		echo has_post_thumbnail( $post_id ) ? get_the_post_thumbnail( $post_id, array( 60, 38 ) ) : '&mdash;';
	}
	if ( 'dd_group_col' === $col ) {
		$g = get_post_meta( $post_id, 'dd_group', true );
		echo 'product' === $g ? esc_html__( 'Product', 'dd-portfolio-cms' ) : esc_html__( 'Client', 'dd-portfolio-cms' );
	}
}, 10, 2 );

/* -------------------------------------------------------------------------
 * 4. Settings page — allowed frontend origin(s) for CORS
 * ---------------------------------------------------------------------- */

add_action( 'admin_menu', function () {
	add_submenu_page(
		'edit.php?post_type=dd_project',
		__( 'Portfolio API Settings', 'dd-portfolio-cms' ),
		__( 'API Settings', 'dd-portfolio-cms' ),
		'manage_options',
		'dd-portfolio-settings',
		'dd_portfolio_settings_page'
	);
} );

add_action( 'admin_init', function () {
	register_setting( 'dd_portfolio_settings', 'dd_portfolio_origins', array(
		'type'              => 'string',
		'sanitize_callback' => 'dd_portfolio_sanitize_origins',
		'default'           => '',
	) );
} );

function dd_portfolio_sanitize_origins( $value ) {
	$lines = preg_split( '/[\r\n,]+/', (string) $value );
	$clean = array();
	foreach ( $lines as $line ) {
		$line = trim( $line );
		if ( '' === $line ) {
			continue;
		}
		if ( '*' === $line ) {
			$clean[] = '*';
			continue;
		}
		$line = esc_url_raw( $line );
		if ( $line ) {
			$clean[] = untrailingslashit( $line );
		}
	}
	return implode( "\n", array_unique( $clean ) );
}

function dd_portfolio_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$endpoint = esc_url( rest_url( DD_PORTFOLIO_CMS_REST_NS . '/projects' ) );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Portfolio API Settings', 'dd-portfolio-cms' ); ?></h1>
		<p><?php esc_html_e( 'Your projects are served as JSON at:', 'dd-portfolio-cms' ); ?>
			<br><code><?php echo $endpoint; // phpcs:ignore ?></code>
			<a href="<?php echo $endpoint; // phpcs:ignore ?>" target="_blank" rel="noopener">&rarr; <?php esc_html_e( 'open', 'dd-portfolio-cms' ); ?></a>
		</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'dd_portfolio_settings' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="dd_portfolio_origins"><?php esc_html_e( 'Allowed frontend origins', 'dd-portfolio-cms' ); ?></label></th>
					<td>
						<textarea name="dd_portfolio_origins" id="dd_portfolio_origins" rows="4" class="large-text code" placeholder="https://detaileddevelopment.com&#10;https://www.detaileddevelopment.com"><?php echo esc_textarea( get_option( 'dd_portfolio_origins', '' ) ); ?></textarea>
						<p class="description">
							<?php esc_html_e( 'One origin per line (scheme + host, no trailing slash). These are allowed to read the API from a browser. Use * to allow any origin (the data is public anyway). Leave blank to disable cross-origin reads.', 'dd-portfolio-cms' ); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * 5. REST endpoint: /wp-json/dd/v1/projects
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', 'dd_portfolio_register_rest' );
function dd_portfolio_register_rest() {
	register_rest_route(
		DD_PORTFOLIO_CMS_REST_NS,
		'/projects',
		array(
			'methods'             => 'GET',
			'callback'            => 'dd_portfolio_rest_projects',
			'permission_callback' => '__return_true', // public read-only data
		)
	);
}

function dd_portfolio_rest_projects( $request ) {
	$query = new WP_Query( array(
		'post_type'      => 'dd_project',
		'post_status'    => 'publish',          // Draft = hidden.
		'posts_per_page' => -1,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	) );

	$client   = array();
	$products = array();

	foreach ( $query->posts as $post ) {
		$item  = dd_portfolio_format_project( $post );
		$group = get_post_meta( $post->ID, 'dd_group', true );
		if ( 'product' === $group ) {
			$products[] = $item;
		} else {
			$client[] = $item;
		}
	}

	wp_reset_postdata();

	$response = rest_ensure_response( array(
		'client'   => $client,
		'products' => $products,
	) );

	// Light caching: safe to cache for a minute at the CDN/browser.
	$response->header( 'Cache-Control', 'public, max-age=60, s-maxage=60' );

	return $response;
}

/**
 * Normalize a project post into the shape the React app expects.
 */
function dd_portfolio_format_project( $post ) {
	$id = $post->ID;

	$stack_raw   = (string) get_post_meta( $id, 'dd_stack', true );
	$bullets_raw = (string) get_post_meta( $id, 'dd_bullets', true );

	$stack = array_values( array_filter( array_map( 'trim', explode( ',', $stack_raw ) ), 'strlen' ) );
	$bullets = array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', $bullets_raw ) ), 'strlen' ) );

	$image    = null;
	$image_id = get_post_thumbnail_id( $id );
	if ( $image_id ) {
		$full = wp_get_attachment_image_url( $image_id, 'large' );
		if ( $full ) {
			$image = array(
				'url' => $full,
				'alt' => trim( (string) get_post_meta( $image_id, '_wp_attachment_image_alt', true ) ),
			);
		}
	}

	$url = (string) get_post_meta( $id, 'dd_url', true );

	return array(
		'slug'        => $post->post_name,
		'name'        => get_the_title( $post ),
		'industry'    => (string) get_post_meta( $id, 'dd_industry', true ),
		'stack'       => $stack,
		'summary'     => (string) get_post_meta( $id, 'dd_summary', true ),
		'bullets'     => $bullets,
		'description' => (string) get_post_meta( $id, 'dd_description', true ),
		'url'         => $url !== '' ? $url : null,
		'image'       => $image,
	);
}

/* -------------------------------------------------------------------------
 * 6. CORS for our REST namespace
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', function () {
	// Run late so we override the core CORS header behavior for our routes.
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', 'dd_portfolio_send_cors_headers', 15 );
}, 15 );

function dd_portfolio_send_cors_headers( $served ) {
	$origin = get_http_origin();
	if ( ! $origin ) {
		return $served;
	}

	$allowed = preg_split( '/[\r\n,]+/', (string) get_option( 'dd_portfolio_origins', '' ) );
	$allowed = array_filter( array_map( 'trim', $allowed ), 'strlen' );

	$ok = in_array( '*', $allowed, true ) || in_array( untrailingslashit( $origin ), array_map( 'untrailingslashit', $allowed ), true );

	if ( $ok ) {
		header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
		header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type' );
		header( 'Vary: Origin' );
	}

	return $served;
}

/* -------------------------------------------------------------------------
 * 7. Seed the three existing projects on activation (one-time, optional)
 * ---------------------------------------------------------------------- */

register_activation_hook( __FILE__, 'dd_portfolio_seed' );
function dd_portfolio_seed() {
	dd_portfolio_register_cpt();

	// Only seed once, and only if there are no projects yet.
	if ( get_option( 'dd_portfolio_seeded' ) ) {
		return;
	}
	$existing = get_posts( array( 'post_type' => 'dd_project', 'posts_per_page' => 1, 'post_status' => 'any', 'fields' => 'ids' ) );
	if ( ! empty( $existing ) ) {
		update_option( 'dd_portfolio_seeded', 1 );
		return;
	}

	$seed = array(
		array(
			'name'        => 'Gateway Bible Church',
			'group'       => 'client',
			'industry'    => 'Church / Community',
			'stack'       => 'WordPress, Astra, Elementor',
			'summary'     => 'A clear digital front door for a local church — service times, events, giving, and sermons without the maze.',
			'bullets'     => "Visitor-first pathways: plan your visit, service times, and this week at a glance\nOnline giving, prayer request forms, and e-bulletin content\nYouTube sermon integration and a recurring events setup the staff can update themselves",
			'description' => 'Gateway needed a site that worked for two very different visitors: someone checking service times on a Saturday night, and a long-time member looking for the e-bulletin. We organized everything around what people actually come to do — visit, watch, give, connect — and built it so the church staff can update content without calling us.',
			'url'         => 'https://gatewaybiblechurch.org',
		),
		array(
			'name'        => "Heidi's Village",
			'group'       => 'client',
			'industry'    => 'Animal Welfare Nonprofit',
			'stack'       => 'WordPress, Elementor',
			'summary'     => 'A nonprofit animal welfare site built around the four things that keep the lights on: donate, adopt, foster, volunteer.',
			'bullets'     => "Donation pathways that are never more than one click away\nAdoption, foster, volunteer, and rescue-partner flows with clear next steps\nImpact stats, news, and events woven into the organizational story",
			'description' => "Heidi's Village does a lot — sheltering, veterinary care, rescue partnerships, community programs. The challenge was architecture: surfacing donation and adoption pathways everywhere without burying the mission storytelling that builds trust. We structured a large content footprint so every page leads somewhere useful.",
			'url'         => 'https://heidisvillage.org',
		),
		array(
			'name'        => 'Circuit AZ',
			'group'       => 'client',
			'industry'    => 'Music / Events',
			'stack'       => 'WordPress, Elementor',
			'summary'     => 'An Arizona electronic music brand — events, media, shop, and every streaming platform link in one place.',
			'bullets'     => "Upcoming and past event promotion with a visual-first layout\nMedia gallery, shop pathway, and music platform integrations\nA brand experience that feels like the events, not a brochure",
			'description' => "An events brand lives or dies on energy, and most event websites have none. Circuit AZ's site leads with visuals — event art, media, the brand itself — while keeping the practical stuff (tickets, dates, socials, shop) one tap away. Built to be updated fast between shows.",
			'url'         => 'https://circuitaz.com',
		),
		array(
			'name'     => 'Event Calendar',
			'group'    => 'product',
			'industry' => 'WordPress Plugin',
			'stack'    => 'PHP, JavaScript, WordPress',
			'summary'  => "A calendar plugin that doesn't make you want to close the tab. Filtering, search, responsive — the whole deal.",
			'url'      => 'https://github.com/detailed-development/event-calendar',
		),
		array(
			'name'     => 'Client Store Locator',
			'group'    => 'product',
			'industry' => 'WordPress Plugin',
			'stack'    => 'PHP, Google Maps API, WordPress',
			'summary'  => 'Interactive map with proximity search and custom markers. Turns out people really do want to find the nearest location.',
			'url'      => 'https://github.com/detailed-development/client-store-locator',
		),
		array(
			'name'     => 'Internal Social Dashboard',
			'group'    => 'product',
			'industry' => 'Web Application',
			'stack'    => 'React, Node.js, APIs',
			'summary'  => 'One screen to see how content is performing across platforms. Replaced a very sad collection of bookmarked analytics pages.',
			'url'      => 'https://github.com/detailed-development/internal-social-dashboard',
		),
		array(
			'name'     => 'Party Favor',
			'group'    => 'product',
			'industry' => 'iOS App',
			'stack'    => 'Swift, SwiftUI, iOS',
			'summary'  => "An iOS app we're working on. Can't say too much yet, but we're pretty excited about this one.",
			'url'      => '',
		),
	);

	$order = 0;
	foreach ( $seed as $row ) {
		$post_id = wp_insert_post( array(
			'post_type'   => 'dd_project',
			'post_title'  => $row['name'],
			'post_status' => 'publish',
			'menu_order'  => $order++,
		) );
		if ( is_wp_error( $post_id ) || ! $post_id ) {
			continue;
		}
		update_post_meta( $post_id, 'dd_group', $row['group'] );
		update_post_meta( $post_id, 'dd_industry', $row['industry'] );
		update_post_meta( $post_id, 'dd_stack', $row['stack'] );
		update_post_meta( $post_id, 'dd_summary', $row['summary'] );
		update_post_meta( $post_id, 'dd_bullets', isset( $row['bullets'] ) ? $row['bullets'] : '' );
		update_post_meta( $post_id, 'dd_description', isset( $row['description'] ) ? $row['description'] : '' );
		update_post_meta( $post_id, 'dd_url', $row['url'] );
	}

	update_option( 'dd_portfolio_seeded', 1 );
	flush_rewrite_rules();
}

register_deactivation_hook( __FILE__, function () {
	flush_rewrite_rules();
} );
