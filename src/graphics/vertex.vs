#version 300 es
precision mediump float;

uniform mat4 projection;
uniform mat4 modelview;
uniform mat4 model;
uniform mat4 view;
uniform vec3 viewer_loc;

uniform vec3 sun_dir;
uniform vec3 sun_color;

uniform vec3 light1_loc;
uniform vec3 light1_color;

uniform vec3 light2_loc;
uniform vec3 light2_color;

const float light_attenuation_k = 0.01;
const float light_attenuation_l = 0.1;
const float light_attenuation_q = 0.00; /* no quadratic term for now */

uniform float mat_ambient;
uniform float mat_diffuse;
uniform float mat_specular;
uniform float mat_shininess;

in vec3 coordinates;
in vec4 color;
in vec2 uv;
in vec3 surf_normal;

out vec4 v_color;
out vec2 v_uv;

vec3 diff_color( 
    vec3 normal, 
    vec3 light_dir,
    vec3 light_color, 
    float mat_diffuse 
) {
    return mat_diffuse * light_color * max( dot( normal, light_dir ), 0.0 );
}

vec3 spec_color( 
    vec3 normal, 
    vec3 light_dir,
    vec3 eye_dir, 
    vec3 light_color, 
    float mat_specular,
    float mat_shiniess
) {
    float cos_light_surf_normal = dot( normal, light_dir );

    if( cos_light_surf_normal <= 0.0 ) {
        return vec3( 0.0, 0.0, 0.0 );
    }

    vec3 light_reflection = 
        2.0 * cos_light_surf_normal * normal - light_dir;

    return 
        pow( 
            max( dot( light_reflection, normalize( eye_dir ) ), 0.0  ),
            mat_shininess 
        ) * light_color * mat_specular;
}

float attenuation( vec3 vector_to_light ) {
    float light1_dist = length( vector_to_light );
    float light1_atten = 1.0 / ( 
        light_attenuation_k + 
        light_attenuation_l * light1_dist +
        light_attenuation_q * light1_dist * light1_dist
    );

    return light1_atten;
}

void main( void ) {
    vec3 normal_tx = normalize( mat3( model ) * surf_normal );
    vec3 coords_tx = ( model * vec4( coordinates, 1.0 ) ).xyz;

    gl_Position = projection * modelview * vec4( coordinates, 1.0 );
    vec3 eye_dir = normalize( viewer_loc - coords_tx );

    vec4 ambient_color = vec4( mat_ambient, mat_ambient, mat_ambient, 1.0 );

    // vec3 sun_dir_tx = 
    float cos_sun_dir_surf_normal = dot( sun_dir, normal_tx );
    vec3 sun_diffuse_color = diff_color( normal_tx, sun_dir, sun_color, mat_diffuse );
    
    vec3 sun_spec_color =
        spec_color( normal_tx, sun_dir, eye_dir, sun_color, mat_specular, mat_shininess );

    vec4 color_from_sun = vec4( sun_diffuse_color + sun_spec_color, 1.0 );

    vec3 vector_to_light1 = light1_loc - coords_tx;
    vec3 light1_dir = normalize( vector_to_light1 );
    float light1_atten = attenuation( vector_to_light1 );

    vec3 vector_to_light2 = light2_loc - coords_tx;
    vec3 light2_dir = normalize( vector_to_light2 );
    float light2_atten = attenuation( vector_to_light2 );

    vec3 light1_diffuse_color = diff_color( 
        normal_tx, light1_dir, light1_color, mat_diffuse);
    vec3 light1_spec_color = spec_color( 
        normal_tx, light1_dir, eye_dir, light1_color, mat_specular, mat_shininess );
    vec4 color_from_light1 = vec4(
            ( light1_diffuse_color + light1_spec_color ) * light1_atten, 1.0 );

    vec3 light2_diffuse_color = diff_color( 
        normal_tx, light2_dir, light2_color, mat_diffuse);
    vec3 light2_spec_color = spec_color( 
        normal_tx, light2_dir, eye_dir, light2_color, mat_specular, mat_shininess );
    vec4 color_from_light2 = vec4(
            ( light2_diffuse_color + light2_spec_color ) * light2_atten, 1.0 );

    /* multiply color by 0 to remove it. try changing the 0 to a small number like .2
    and the 1 to the complement of that number (1 - .2 = .8) to see how color blending works.*/
    v_color = 
        ( 0.0 * color ) + 
        ( 1.0 * (
            ambient_color +
            color_from_sun +
            color_from_light1 +
            color_from_light2
        ) );
    v_uv = uv;
}