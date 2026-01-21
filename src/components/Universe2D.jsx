import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, useGLTF } from "@react-three/drei";

const Model2D = ({ position = [0, 0, 0], scale = 1.5 }) => {
    const { scene } = useGLTF("/assets/model.glb");
    return (
        <primitive
            object={scene}
            position={position}
            scale={scale}
            rotation={[0, Math.PI / 4, 0]} // Fixed diagonal view for 2D feel
        />
    );
};

const Universe2D = () => {
    return (
        <div className="w-full h-full bg-[#0b0e14]">
            <Canvas dpr={[1, 1]}>
                <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={80} />

                <ambientLight intensity={1.5} />

                <Suspense fallback={null}>
                    <Model2D position={[0, 0, 0]} scale={3} />
                </Suspense>

                <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} rotation={[Math.PI / 2, 0, 0]} />
            </Canvas>
        </div>
    );
};

export default Universe2D;
