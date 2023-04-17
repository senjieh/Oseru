#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv;

out vec4 f_color;

uniform sampler2D tex_0;

void main( void ) {
    f_color = v_color * texture( tex_0, v_uv ); 

    /* we can test depth values with this.
    f_color = vec4(vec3(gl_FragCoord.z), 1.0); */
}