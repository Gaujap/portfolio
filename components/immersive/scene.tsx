"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";

/*
 * The immersive backdrop: a drifting particle field and a thematic wireframe
 * form per project — a waveform ring for the voice assistant, a shelf of media
 * spines for the tracker, a ranking stack for the creator platform, a floor
 * plan for the renovation manager, a LiDAR room scan for the surveying app, a
 * node queue for the agent pipeline, two bridged clusters for the network, a
 * timetable lattice for the scheduler. The camera dollies with scroll and
 * leans toward the pointer.
 *
 * WebGL can't read CSS custom properties (and three can't parse oklch), so the
 * theme palettes are mirrored here. `visuals` is recomputed once per frame by
 * the centerpiece and applied by every form's material.
 */
/*
 * Two moods, one world: dark mode is a night sky (additive, glowing), light
 * mode is an architect's drawing on paper (normal blending, ink-like lines).
 */
const PALETTES = {
  dark: { accent: "#d9694c", dust: "#a79e90" },
  light: { accent: "#a03e26", dust: "#7d7468" },
} as const;

const visuals = {
  accent: PALETTES.dark.accent as string,
  opacity: 0.1,
  /** Which form is currently up — forms only animate while active. */
  activeForm: 0,
  /** Bumped when the theme flips; materials re-sync lazily. */
  version: 0,
};

/** A wireframe material that follows `visuals` every frame. */
function useSyncedMaterial(): THREE.MeshBasicMaterial {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        color: PALETTES.dark.accent,
      }),
    [],
  );
  useFrame(() => {
    material.opacity = visuals.opacity;
    if (material.userData.version !== visuals.version) {
      material.userData.version = visuals.version;
      material.color.set(visuals.accent);
    }
  });
  return material;
}

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const theme = useRef<string>("");

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // A loose cylinder around the camera path, denser toward the middle.
      const radius = 5 + Math.random() * 13;
      const angle = Math.random() * Math.PI * 2;
      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = (Math.random() - 0.5) * 18;
      array[i * 3 + 2] = Math.sin(angle) * radius - 8;
    }
    return array;
  }, [count]);

  useFrame((state) => {
    const mesh = points.current;
    if (!mesh) return;
    // Slow drift plus a push from scroll, so scrolling stirs the field.
    mesh.rotation.y =
      state.clock.elapsedTime * 0.018 + scrollState.page * Math.PI * 0.6;
    mesh.position.y = scrollState.page * 3;

    const paletteKey = document.documentElement.className;
    if (theme.current !== paletteKey) {
      theme.current = paletteKey;
      const dark = document.documentElement.classList.contains("dark");
      const material = mesh.material as THREE.PointsMaterial;
      material.color.set(dark ? PALETTES.dark.dust : PALETTES.light.dust);
      // Stars at night; faint paper flecks by day (additive washes out on
      // light backgrounds).
      material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      material.opacity = dark ? 0.55 : 0.28;
      material.size = dark ? 0.045 : 0.032;
      material.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={PALETTES.dark.dust}
      />
    </points>
  );
}

/* --- Thematic forms (one per project, in projects.ts order) --- */

/** Hermes: a circular audio waveform — bars pulsing around a ring. */
function WaveformRing({ index }: { index: number }) {
  const BARS = 40;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useSyncedMaterial();
  const proxy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced || visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < BARS; i++) {
      const angle = (i / BARS) * Math.PI * 2;
      const height =
        0.4 + Math.abs(Math.sin(t * 2.1 + i * 0.6) + Math.sin(t * 0.7 + i)) * 0.55;
      proxy.position.set(Math.cos(angle) * 1.9, 0, Math.sin(angle) * 1.9);
      proxy.rotation.y = -angle;
      proxy.scale.set(1, height, 1);
      proxy.updateMatrix();
      instanced.setMatrixAt(i, proxy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, BARS] as unknown as [THREE.BufferGeometry, THREE.Material, number]}
      material={material}
    >
      <boxGeometry args={[0.09, 1, 0.09]} />
    </instancedMesh>
  );
}

/** Shelf: rows of media spines, a browsing wave tipping each one as it passes. */
function ShelfForm({ index }: { index: number }) {
  const COLS = 7;
  const ROWS = 3;
  const COUNT = COLS * ROWS;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useSyncedMaterial();
  const proxy = useMemo(() => new THREE.Object3D(), []);

  // Stable, varied spine heights so the shelf reads as a real collection
  // rather than a grid — deterministic, so every load looks the same.
  const heights = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => 0.62 + (((i * 37) % 11) / 11) * 0.7),
    [COUNT],
  );

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced || visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    // A browsing wave runs along the shelves, tipping each spine forward as it
    // passes — like a finger trailing across the collection.
    const sweep = ((t * 1.6) % (COLS + 2)) - 1;
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const nearness = Math.max(0, 1 - Math.abs(sweep - col));
      const lift = nearness * 0.3;
      proxy.position.set(
        (col - (COLS - 1) / 2) * 0.34,
        (row - (ROWS - 1) / 2) * 0.82,
        lift * 0.6,
      );
      proxy.rotation.z = nearness * -0.24;
      proxy.scale.set(1, heights[i] + lift, 1);
      proxy.updateMatrix();
      instanced.setMatrixAt(i, proxy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.12, 0.2, 0]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, COUNT] as unknown as [THREE.BufferGeometry, THREE.Material, number]}
        material={material}
      >
        <boxGeometry args={[0.16, 1, 0.08]} />
      </instancedMesh>
    </group>
  );
}

/** Vybe: a ranking stack — planes bobbing as the order shifts. */
function RankingStack({ index }: { index: number }) {
  const PLANES = 5;
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const material = useSyncedMaterial();

  useFrame((state) => {
    if (visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((plane, i) => {
      if (!plane) return;
      plane.position.y = (i - (PLANES - 1) / 2) * 0.62 + Math.sin(t * 1.4 + i * 1.1) * 0.13;
      plane.rotation.z = Math.sin(t * 0.9 + i) * 0.04;
    });
  });

  return (
    <group rotation={[0.35, 0, 0]}>
      {Array.from({ length: PLANES }, (_, i) => (
        <mesh
          key={i}
          material={material}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <planeGeometry args={[2.5, 1.3, 4, 2]} />
        </mesh>
      ))}
    </group>
  );
}

/** Domus: a floor plan whose rooms rise wall by wall as the renovation lands. */
function FloorPlan({ index }: { index: number }) {
  // A small apartment footprint on the ground plane: [x, z, width, depth].
  const ROOMS = useMemo(
    () =>
      [
        [-1.1, -0.6, 1.2, 1.0],
        [0.45, -0.7, 1.5, 0.8],
        [-1.2, 0.7, 0.9, 1.3],
        [0.2, 0.65, 1.1, 1.1],
        [1.4, 0.35, 0.7, 1.5],
      ] as const,
    [],
  );
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const material = useSyncedMaterial();

  useFrame((state) => {
    if (visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    // A build wave sweeps across the plan, raising each room's walls in turn.
    const sweep = (t * 0.9) % (ROOMS.length + 1.5);
    refs.current.forEach((room, i) => {
      if (!room) return;
      const rise = Math.min(1, Math.max(0, 1 - Math.abs(sweep - i)));
      room.scale.y = 0.18 + (0.35 + rise * 0.65) * 0.9;
    });
  });

  return (
    // Tilted back so the plan reads as a floor seen at an angle.
    <group rotation={[-0.95, 0.3, 0]}>
      {ROOMS.map(([x, z, w, d], i) => (
        <mesh
          key={i}
          material={material}
          position={[x, 0, z]}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <boxGeometry args={[w, 1, d]} />
        </mesh>
      ))}
    </group>
  );
}

/** Cotae: a LiDAR room scan — points on the room shell lighting as the sweep passes. */
function RoomScan({ index }: { index: number }) {
  const W = 2.4;
  const H = 1.8;
  const D = 2.0;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useSyncedMaterial();
  const proxy = useMemo(() => new THREE.Object3D(), []);

  // Deterministic points spread across the six faces of the room shell — the
  // captured surfaces of a scanned room.
  const points = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    const GX = 6;
    const GY = 5;
    const GZ = 5;
    const at = (i: number, n: number, span: number) => (i / (n - 1) - 0.5) * span;
    for (let i = 0; i < GX; i++) {
      for (let k = 0; k < GZ; k++) {
        pts.push([at(i, GX, W), -H / 2, at(k, GZ, D)]); // floor
        pts.push([at(i, GX, W), H / 2, at(k, GZ, D)]); // ceiling
      }
    }
    for (let i = 0; i < GX; i++) {
      for (let j = 0; j < GY; j++) {
        pts.push([at(i, GX, W), at(j, GY, H), -D / 2]); // front / back walls
        pts.push([at(i, GX, W), at(j, GY, H), D / 2]);
      }
    }
    for (let k = 0; k < GZ; k++) {
      for (let j = 0; j < GY; j++) {
        pts.push([-W / 2, at(j, GY, H), at(k, GZ, D)]); // side walls
        pts.push([W / 2, at(j, GY, H), at(k, GZ, D)]);
      }
    }
    return pts;
  }, []);

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced || visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    // A horizontal scan plane sweeps up and down the room; points near it pop.
    const scanY = Math.sin(t * 0.8) * (H / 2);
    for (let i = 0; i < points.length; i++) {
      const [x, y, z] = points[i];
      const near = Math.max(0, 1 - Math.abs(y - scanY) * 2.4);
      proxy.position.set(x, y, z);
      proxy.scale.setScalar(0.03 + near * 0.09);
      proxy.updateMatrix();
      instanced.setMatrixAt(i, proxy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.12, 0.5, 0]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, points.length] as unknown as [THREE.BufferGeometry, THREE.Material, number]}
        material={material}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </group>
  );
}

/** MCP pipeline: a queue of nodes with a pulse travelling down the line. */
function NodeQueue({ index }: { index: number }) {
  const NODES = 6;
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const material = useSyncedMaterial();

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      Array.from(
        { length: NODES },
        (_, i) => new THREE.Vector3((i - (NODES - 1) / 2) * 0.95, 0, 0),
      ),
    );
    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ transparent: true, color: PALETTES.dark.accent }),
    );
  }, []);

  useFrame((state) => {
    const lineMaterial = line.material as THREE.LineBasicMaterial;
    lineMaterial.opacity = visuals.opacity * 0.7;
    if (lineMaterial.userData.version !== visuals.version) {
      lineMaterial.userData.version = visuals.version;
      lineMaterial.color.set(visuals.accent);
    }
    if (visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    const pulse = (t * 1.4) % NODES;
    refs.current.forEach((node, i) => {
      if (!node) return;
      const boost = Math.max(0, 1 - Math.abs(pulse - i)) * 0.65;
      node.scale.setScalar(1 + boost);
      node.rotation.y = t * 0.6 + i;
    });
  });

  return (
    <group rotation={[0, 0, 0.22]}>
      <primitive object={line} />
      {Array.from({ length: NODES }, (_, i) => (
        <mesh
          key={i}
          material={material}
          position={[(i - (NODES - 1) / 2) * 0.95, 0, 0]}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <octahedronGeometry args={[0.3, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/** Network infra: two sites bridged by one link, a packet in transit. */
function BridgedClusters({ index }: { index: number }) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const packet = useRef<THREE.Mesh>(null);
  const material = useSyncedMaterial();

  const bridge = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.55, 0, 0),
      new THREE.Vector3(1.55, 0, 0),
    ]);
    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ transparent: true, color: PALETTES.dark.accent }),
    );
  }, []);

  useFrame((state) => {
    const bridgeMaterial = bridge.material as THREE.LineBasicMaterial;
    bridgeMaterial.opacity = visuals.opacity * 0.6;
    if (bridgeMaterial.userData.version !== visuals.version) {
      bridgeMaterial.userData.version = visuals.version;
      bridgeMaterial.color.set(visuals.accent);
    }
    if (visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    left.current?.rotation.set(0, t * 0.5, 0);
    right.current?.rotation.set(0, -t * 0.5, 0);
    // The packet ping-pongs between the two sites.
    if (packet.current) {
      const phase = (Math.sin(t * 1.3) + 1) / 2;
      packet.current.position.x = -1.55 + phase * 3.1;
    }
  });

  return (
    <group>
      <primitive object={bridge} />
      <mesh ref={left} material={material} position={[-1.55, 0, 0]}>
        <icosahedronGeometry args={[0.72, 0]} />
      </mesh>
      <mesh ref={right} material={material} position={[1.55, 0, 0]}>
        <icosahedronGeometry args={[0.72, 0]} />
      </mesh>
      <mesh ref={packet} material={material}>
        <sphereGeometry args={[0.09, 8, 8]} />
      </mesh>
    </group>
  );
}

/** Scheduling: a timetable lattice, slots breathing as they fill. */
function TimetableLattice({ index }: { index: number }) {
  const COLS = 6;
  const ROWS = 4;
  const COUNT = COLS * ROWS;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useSyncedMaterial();
  const proxy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced || visuals.activeForm !== index) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const fill = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.8 + col * 0.7 + row * 1.3));
      proxy.position.set((col - (COLS - 1) / 2) * 0.52, (row - (ROWS - 1) / 2) * 0.52, 0);
      proxy.scale.setScalar(fill * 0.42);
      proxy.updateMatrix();
      instanced.setMatrixAt(i, proxy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[-0.5, 0.25, 0]}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, COUNT] as unknown as [THREE.BufferGeometry, THREE.Material, number]}
        material={material}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </group>
  );
}

const FORMS = [
  WaveformRing, // Hermes
  ShelfForm, // Shelf
  RankingStack, // Vybe
  FloorPlan, // Domus
  RoomScan, // Cotae
  NodeQueue, // Notion / MCP pipeline
  BridgedClusters, // Hybrid network
  TimetableLattice, // Ski & theatre scheduling
];

function Centerpiece({
  fixedForm,
  presence,
}: {
  /** Lock the centerpiece to one project's form (work pages). */
  fixedForm?: number;
  /** Constant presence override; defaults to the console-driven value. */
  presence?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    const active = fixedForm ?? scrollState.activeProject;
    const lit = presence ?? scrollState.projectsPresence;
    visuals.activeForm = active;

    // Update the shared visuals once per frame. Light mode draws in denser
    // ink strokes; dark mode stays a soft glow.
    const dark = document.documentElement.classList.contains("dark");
    visuals.opacity = dark ? 0.1 + lit * 0.42 : 0.2 + lit * 0.5;
    const accent = dark ? PALETTES.dark.accent : PALETTES.light.accent;
    if (visuals.accent !== accent) {
      visuals.accent = accent;
      visuals.version++;
    }

    // Gentle spin; thematic forms read best staying near upright.
    g.rotation.y += delta * 0.16;
    g.rotation.z += (scrollState.pointerX * 0.16 - g.rotation.z) * 0.05;
    g.position.y += (-scrollState.pointerY * 0.4 - g.position.y) * 0.05;

    // A ghost behind quiet sections; fully lit when the work is on stage.
    g.scale.setScalar(0.75 + lit * 0.45);

    // Only the active form is up; the others fold away.
    g.children.forEach((child, i) => {
      const target = i === active ? 1 : 0;
      const next = child.scale.x + (target - child.scale.x) * 0.07;
      child.scale.setScalar(Math.max(0.0001, next));
      child.visible = next > 0.02;
    });
  });

  return (
    // Offset right so it frames the left-aligned type instead of sitting on it.
    <group ref={group} position={[2.7, 0, -3]}>
      {FORMS.map((Form, i) => (
        <group key={i} scale={i === (fixedForm ?? 0) ? 1 : 0.0001}>
          <Form index={i} />
        </group>
      ))}
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((state) => {
    // Dolly in with scroll; breathe on time; lean toward the pointer.
    camera.position.z = 9.5 - scrollState.page * 2.2;
    const targetX =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.35 + scrollState.pointerX * 0.7;
    const targetY =
      Math.cos(state.clock.elapsedTime * 0.13) * 0.25 - scrollState.pointerY * 0.45;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -3);
  });
  return null;
}

export function Scene({
  fixedForm,
  presence,
}: {
  fixedForm?: number;
  presence?: number;
}) {
  // Lighter world on small screens: fewer particles, capped resolution.
  const small =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  return (
    <Canvas
      dpr={small ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0, 9.5], fov: 52 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <Rig />
      <Particles count={small ? 850 : 1600} />
      <Centerpiece fixedForm={fixedForm} presence={presence} />
    </Canvas>
  );
}
