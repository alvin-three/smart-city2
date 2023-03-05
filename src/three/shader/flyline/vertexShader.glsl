attribute float aSize;
varying float vSize;
uniform float uTime;
uniform float uLength;
void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
    gl_Position = projectionMatrix * viewPosition;
    // 从中间开始展示;
    //  其实点没有动，只是将 点的大小，随着时间的推移，不断地变大，变小，得到的
    // 没看懂
    vSize = aSize - uTime;
    if(vSize < 0.0) {
        vSize = uLength + vSize;
    }
    vSize = (vSize - 500.0) * 0.1;
    // 近大远小
    gl_PointSize = -vSize / viewPosition.z;
}