import { Geometry } from "../js-lib/3dEngine/sceneGraph/Geometry.js"

/**
 * @implements {Material}
 */
export class OnlyColorPhongMaterial {
    needsDelete = false
    vertexShader() {
        return `#version 300 es
in vec3 position;
in vec3 normal;
in vec2 uv;

layout(std140) uniform cameraUbo {
    mat4 viewMatrix;
    mat4 projectionMatrix;
    mat4 projectionViewMatrix;
    mat4 projectionViewMatrixInverse;
    vec3 cameraPosition;
    float near;
    float far;
};

uniform mat4 modelView;

out vec3 v_normal;
out vec2 v_uv;
out vec3 v_surfaceToView;
out vec3 v_worldPosition;

void main() {
    vec4 worldPosition = modelView * vec4(position, 1.0);
    
    gl_Position = projectionViewMatrix * worldPosition;

    v_normal = mat3(modelView) * normal;
    v_uv = uv;
    v_worldPosition = worldPosition.xyz / worldPosition.w;
    v_surfaceToView = cameraPosition - v_worldPosition;
}`
    }
    fragmentShader({ pointLightCount }) {
        return `#version 300 es
precision highp float;

${pointLightCount > 0 ? '#define POINT_LIGHT' : ''}

in vec3 v_normal;
in vec2 v_uv;

in vec3 v_surfaceToView;
in vec3 v_worldPosition;

uniform vec3 color;

uniform vec3 specular;
uniform float shininess;               
        
out vec4 outColor;

#ifdef POINT_LIGHT
struct PointLight {
    vec3 position;
    float intensity;
    vec3 color;                    
};               

layout(std140) uniform pointLightsUBO {
    PointLight pointLights[${pointLightCount}];
};

void calcPointLight(in vec3 normal, out vec3 color, out float specular){
    for (int i = 0; i < ${pointLightCount}; i++) {
        PointLight pointLight = pointLights[i];

        vec3 L = normalize(pointLight.position - v_worldPosition);

        float lambertian = max(dot(normal, L), 0.0);
        color += lambertian * pointLight.color;

        vec3 R = reflect(L, normal); // Reflected light vector
        vec3 V = normalize(-v_worldPosition); // Vector to viewer

        float specAngle = max(dot(R, V), 0.0);
        specular += pow(specAngle, shininess);
    }
}
#endif

void main() {
    vec3 normal = normalize(v_normal);
    
    vec3 ambientLight = vec3(0.1, 0.1, 0.1);

    vec3 pointLightColor;
    float pointLightSpecular;

    #ifdef POINT_LIGHT
    calcPointLight(normal, pointLightColor, pointLightSpecular);
    #endif

    vec3 lightColor = ambientLight + pointLightColor;
    float lightSpecular = pointLightSpecular;               

    outColor = vec4(color * lightColor + lightSpecular * specular, 1.);
}`
    }
    createUniforms() { return {} } // TODO
    createTextures() { return {} } // TODO
    createGeometry() { return new Geometry(0) } // TODO
}
