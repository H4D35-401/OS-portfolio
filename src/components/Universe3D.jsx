import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera, Stars, useGLTF, Environment } from "@react-three/drei";

const Model = ({ position = [0, 0, 0], scale = 2 }) => {
    const { scene } = useGLTF("/assets/model.glb");
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <primitive object={scene} position={position} scale={scale} />
        </Float>
    );
};

const Universe3D = () => {
    return (
        <div className="w-full h-full bg-[#05070a]">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <Model position={[0, -1, 0]} scale={2.5} />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default Universe3D;
