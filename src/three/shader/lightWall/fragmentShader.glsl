uniform float uHeight;
varying vec3 vPosition;
void main() {
    // 计算 颜色混合的比例, min -> max 可能为负值，但是颜色混合的值都是在（0,1）之间
    float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
    gl_FragColor = vec4(1,1,0, 1.0 - gradMix);
}