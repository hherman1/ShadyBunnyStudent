#version 330

// Fragment shader

// Textures
uniform sampler2D diffuseRamp;
uniform sampler2D specularRamp;

uniform vec3 eye_world;

// These get passed in from the vertex shader and are interpolated (varying) properties
// change for each pixel across the triangle:
in vec4 interpSurfPosition;
in vec3 interpSurfNormal;

// This is an out variable for the final color we want to render this fragment.
out vec4 fragColor;

//props
uniform vec3 ambientReflectionCoeff;
uniform vec3 diffuseReflectionCoeff;
uniform vec3 specularReflectionCoeff;
uniform float specularExponent;

uniform vec3 ambientLightIntensity;
uniform vec3 diffuseLightIntensity;
uniform vec3 specularLightIntensity;

uniform vec4 lightPosition;


void main() {

    // Start with black and then add lighting to the final color as we calculate it
	vec3 finalColor = vec3(0.0, 0.0, 0.0);

    // TODO: Calculate ambient, diffuse, and specular lighting for this pixel based on its position, normal, etc.
	vec3 norm = normalize(interpSurfNormal);
	vec3 lightDirection = normalize(vec3(lightPosition - interpSurfPosition)); //points towards the light
    vec3 observerDirection = normalize(eye_world - vec3(interpSurfPosition));
    
    float ambient_intensity = 1;
    vec3 ambient_color = ambientLightIntensity * ambientReflectionCoeff;
    finalColor += ambient_color;

    float diffuse_intensity = max(0,dot(norm,lightDirection));
    vec3 diffuse_ramp_lookup = vec3(texture(diffuseRamp,vec2(diffuse_intensity,0)));
    vec3 diffuse_color = diffuse_ramp_lookup * diffuseLightIntensity * diffuseReflectionCoeff;
    finalColor += diffuse_color;

    vec3 halfwayVec = normalize(lightDirection + observerDirection);
    float specular_intensity = pow(dot(halfwayVec,norm),specularExponent);
    vec3 specular_ramp_lookup = vec3(texture(specularRamp,vec2(specular_intensity,0)));
    vec3 specular_color = specular_ramp_lookup * specularLightIntensity * specularReflectionCoeff;
    finalColor += specular_color;
    
    
    
    
    
    
    
    
	// Tell OpenGL to use the r,g,b compenents of finalColor for the color of this fragment (pixel).
	fragColor.rgb = finalColor.rgb;

	// And, set the alpha component to 1.0 (completely opaque, no transparency).
	fragColor.a = 1.0;
}
