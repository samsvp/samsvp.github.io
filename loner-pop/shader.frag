#ifdef GL_ES
precision highp float;
#endif

// This is optimized to best of my abilities to run like shit on cellphones.
// Without the optimizations such as loop unroling, it doesn't run at all.

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926535

#define cmul(a, b) vec2(a.x*b.x-a.y*b.y, dot(a, b.yx))
#define cdiv(a, b) 1.0/dot(b,b)*vec2(dot(a,b),(a.y*b.x-a.x*b.y))

/* Complex exponential */
vec2 cexp(vec2 z)
{
    float exp_x = exp(z.x);
    return exp_x * vec2(cos(z.y), sin(z.y));
}

/*
 * Translates the coordinates in the x and y axis
 */
vec2 translate(vec2 coord, vec2 translation)
{
    return translation * 0.5 + coord;
}

vec2 rotate_around(vec2 coord, float angle, vec2 point)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c) * (coord - point) + point;
}

/*
 * Zooms the canvas in or out
 */
vec2 izoom(vec2 coord, float z)
{
    return coord * z;
}

vec2 f(vec2 z)
{
    vec2 zp = vec2(1);
    vec2 z1 = cmul(zp, z) + zp;
    z1 = cmul(z1, z) + z1;
    vec2 z2 = cmul(z1, z) + z1;
    vec2 z3 = cmul(z2, z) + z2;
    vec2 z4 = cmul(z3, z) + z3;
    vec2 z5 = cmul(z4, z) + z4;

    // complex exp
    float exp_x = exp(z.x);
    float czy = cos(z.y);
    float szy = sin(z.y);
    vec2 exp_z = exp_x * vec2(czy, szy);
    vec2 m_exp_z = 1.0 / exp_x * vec2(czy, -szy);
    // sinh
    vec2 shz = 0.5 * (exp_z - m_exp_z);

    return 5.0 * z5 + 0.5 * z4 + 2.0 * z3 + 2.5 * z2 + 3.0 * z1 + vec2(5, 10) + shz - vec2(1);
}

vec4 f_df(vec2 z)
{
    vec2 zp = vec2(1);
    vec2 z1 = cmul(zp, z) + zp;
    z1 = cmul(z1, z) + z1;
    vec2 z2 = cmul(z1, z) + z1;
    vec2 z3 = cmul(z2, z) + z2;
    vec2 z4 = cmul(z3, z) + z3;
    vec2 z5 = cmul(z4, z) + z4;

    // complex exp
    float exp_x = exp(z.x);
    float czy = cos(z.y);
    float szy = sin(z.y);
    vec2 exp_z = exp_x * vec2(czy, szy);
    vec2 m_exp_z = 1.0 / exp_x * vec2(czy, -szy);
    // sinh
    vec2 shz = 0.5 * (exp_z - m_exp_z);
    // cosh
    vec2 chz = 0.5 * (exp_z + m_exp_z);
    vec2 f =
        5.0 * z5 + 2.0 * z3 + 2.5 * z2 + 3.0 * z1 + vec2(4, 9) + shz;
    vec2 df =
        25.0 * z4 + 6.0 * z2 + 5.0 * z + 3.0 + chz;
    return vec4(f, df);
}


vec3 newton_method(vec2 z)
{
    // newton method
    float tol = 0.01;
    float phase = 0.1 * u_time * 2.0 * PI;
    vec2 z0 = z;
    vec2 a = 0.05 * vec2(cos(phase), sin(phase)) + vec2(.87, .85) ;

    // main loop begin
        vec4 f_df_z = f_df(z);
        vec2 div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);

        f_df_z = f_df(z);
        div_z = cdiv(f_df_z.xy, f_df_z.zw);
        z -= cmul(a, div_z);
    // main loop end
    phase = atan(z.y, z.x);
    vec3 c = vec3(phase, 0.7, 0.8);
    float phi = 0.5 * u_time * 2.0 * PI;
    vec4 K =  vec4(
        1.0,
        0.01 * sin(1.25 * phi) + 0.5,
        0.25,
        0.5 * cos(0.05 * phi) + sin(phi * 0.5) + 2.0
    );
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main()
{
    vec2 _coord = (2.0 * gl_FragCoord.xy - u_resolution)
        / min(u_resolution.y, u_resolution.x);

    // translate coords
    vec2 offset = vec2(1, -2);
    vec2 coord = translate(_coord, offset);
    coord = rotate_around(coord, 0.25 * u_time, 0.5 * offset);
    coord = izoom(coord, 0.15);

    vec3 color = newton_method(coord);

    gl_FragColor = vec4(color, 1.0);
}

