import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import ChartLabel from '../label/ChartLabel';

export default function Brain3D({ inputData, phqScore }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const animRef = useRef(null);
  const groupRef = useRef(null);
  const regionsRef = useRef([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const f = useCallback(
    (k, d = 0) => {
      const v = inputData?.[k];
      return v !== undefined ? Number(v) : d;
    },
    [inputData],
  );

  const riskHex = (risk, max) => {
    const r = Math.min(1, (Number(risk) || 0) / (Number(max) || 1));
    if (r < 0.25) return '#2dd4a0';
    if (r < 0.5) return '#fbbf24';
    if (r < 0.75) return '#f97316';
    return '#ef4444';
  };

  // region list dari input data
  const regions = useMemo(
    () => [
      {
        id: 'frontal_l',
        label: 'Frontal Kiri',
        x: -1.0,
        y: 0.62,
        z: 0.95,
        rx: 0.9,
        ry: 0.62,
        rz: 0.8,
        risk: f('SLEEP_RISK_SCORE') + phqScore / 10,
        max: 8,
        variables: ['SLEEP_RISK_SCORE', 'PHQ9_SCORE', 'SOCIAL_JETLAG'],
        explanation:
          'Eksekutif, motivasi, dan regulasi emosi. Gangguan tidur dan PHQ-9 tinggi memengaruhi fungsi perencanaan dan kontrol impuls.',
      },
      {
        id: 'prefrontal',
        label: 'Prefrontal',
        x: 0.0,
        y: 0.8,
        z: 1.1,
        rx: 0.7,
        ry: 0.55,
        rz: 0.7,
        risk: f('SLEEP_RISK_SCORE') + phqScore / 10,
        max: 8,
        variables: ['SLEEP_RISK_SCORE', 'PHQ9_SCORE', 'SOCIAL_JETLAG'],
        explanation:
          'Pengambilan keputusan, kontrol diri, dan regulasi kognitif.',
      },
      {
        id: 'temporal_l',
        label: 'Temporal-L',
        x: -1.2,
        y: 0.0,
        z: 0.22,
        rx: 0.74,
        ry: 0.52,
        rz: 0.78,
        risk: f('SLEEP_RISK_SCORE') + f('SOCIAL_JETLAG') / 2,
        max: 6,
        variables: ['SLEEP_RISK_SCORE', 'SOCIAL_JETLAG'],
        explanation: 'Memori episodik, pemrosesan afek, dan siklus tidur.',
      },
      {
        id: 'temporal_r',
        label: 'Temporal-R',
        x: 1.2,
        y: 0.0,
        z: 0.22,
        rx: 0.74,
        ry: 0.52,
        rz: 0.78,
        risk: f('SLEEP_RISK_SCORE') + f('SOCIAL_JETLAG') / 2,
        max: 6,
        variables: ['SLEEP_RISK_SCORE', 'SOCIAL_JETLAG'],
        explanation: 'Pemrosesan emosi dan sinyal sosial.',
      },
      {
        id: 'parietal',
        label: 'Parietal',
        x: 0.0,
        y: 1.1,
        z: -0.2,
        rx: 0.95,
        ry: 0.55,
        rz: 0.92,
        risk: f('PHYSICALLY_INACTIVE') * 3 + f('SEDENTARY_HIGH') * 2,
        max: 5,
        variables: ['PHYSICALLY_INACTIVE', 'SEDENTARY_HIGH', 'TOTAL_MET_MIN'],
        explanation: 'Integrasi sensorik, kesiagaan, dan visuospasial.',
      },
      {
        id: 'occipital',
        label: 'Occipital',
        x: 0.0,
        y: 0.34,
        z: -1.3,
        rx: 0.6,
        ry: 0.5,
        rz: 0.6,
        risk: phqScore / 6,
        max: 4.5,
        variables: ['PHQ9_SCORE'],
        explanation: 'Beban kognitif visual dan pemrosesan visual.',
      },
      {
        id: 'limbic',
        label: 'Limbic',
        x: 0.0,
        y: 0.02,
        z: 0.0,
        rx: 0.62,
        ry: 0.38,
        rz: 0.48,
        risk: f('TOTAL_RISK_COMPOSITE') / 2,
        max: 6,
        variables: ['TOTAL_RISK_COMPOSITE', 'PHQ9_SCORE', 'LIVING_ALONE'],
        explanation: 'Reaktivitas emosi dan respons terhadap stres.',
      },
      {
        id: 'cerebellum',
        label: 'Cerebellum',
        x: 0.0,
        y: -0.96,
        z: -0.84,
        rx: 0.65,
        ry: 0.4,
        rz: 0.55,
        risk: Math.max(0, f('SEDENTARY_HOURS') - 4),
        max: 8,
        variables: ['SEDENTARY_HOURS', 'PHYSICALLY_INACTIVE'],
        explanation: 'Koordinasi, stabilitas ritme tubuh, dan modulasi motor.',
      },
      {
        id: 'brain_stem',
        label: 'Brain Stem',
        x: 0.0,
        y: -1.15,
        z: -0.05,
        rx: 0.22,
        ry: 0.5,
        rz: 0.2,
        risk: f('SLEEP_RISK_SCORE') * 0.8 + f('UNRESTED_FREQ') * 0.3,
        max: 5,
        variables: ['SLEEP_RISK_SCORE', 'UNRESTED_FREQ', 'INCOME_BINARY'],
        explanation: 'Arousal, regulasi tidur, dan fungsi dasar tubuh.',
      },
    ],
    [f, phqScore],
  );

  useEffect(() => {
    regionsRef.current = regions;
    if (!selectedRegion) setSelectedRegion(regions[0]);
  }, [regions]); // eslint-disable-line

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const width = Math.max(300, el.clientWidth || 300);
    const height = 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.18, 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fb2ff, 0.95);
    rim.position.set(-5, 2, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xa78bfa, 0.7, 30);
    fill.position.set(0, -1.5, 3);
    scene.add(fill);

    const riskColor = (val, max) => {
      const r = Math.min(
        1,
        Math.max(0, (Number(val) || 0) / Math.max(Number(max) || 1, 1)),
      );
      if (r < 0.25) return new THREE.Color(0x2dd4a0);
      if (r < 0.5) return new THREE.Color(0xfbbf24);
      if (r < 0.75) return new THREE.Color(0xf97316);
      return new THREE.Color(0xef4444);
    };

    const group = new THREE.Group();
    const interactiveMeshes = [];

    // cangkang hemisfer otak
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0xd7dff2,
      transparent: true,
      opacity: 0.26,
      shininess: 55,
      side: THREE.DoubleSide,
    });
    const makeHemi = (side) => {
      const g = new THREE.Group();
      const main = new THREE.Mesh(
        new THREE.SphereGeometry(1.78, 40, 28),
        baseMat.clone(),
      );
      main.scale.set(0.96, 0.88, 1.02);
      main.position.set(side * 0.94, 0.28, 0);
      g.add(main);
      for (let i = 0; i < 9; i++) {
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(
            0.78 + i * 0.05,
            0.018,
            8,
            48,
            Math.PI * 0.95,
          ),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.09,
          }),
        );
        band.rotation.set(
          Math.PI / 2.15,
          side * (0.12 + i * 0.02),
          -0.18 + i * 0.06,
        );
        band.position.set(
          side * (0.65 + i * 0.01),
          0.68 - i * 0.09,
          -0.1 + i * 0.05,
        );
        g.add(band);
      }
      return g;
    };
    group.add(makeHemi(-1), makeHemi(1));

    // batang otak
    const fissureMat = new THREE.MeshPhongMaterial({
      color: 0x0d1428,
      transparent: true,
      opacity: 0.85,
    });
    const fissure = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.08, 2.45, 14),
      fissureMat,
    );
    fissure.rotation.z = Math.PI / 2;
    fissure.position.set(0, 0.35, 0.02);
    group.add(fissure);

    const stemMat = new THREE.MeshPhongMaterial({
      color: 0xb8c4df,
      transparent: true,
      opacity: 0.42,
    });
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.26, 1.05, 18),
      stemMat,
    );
    stem.position.set(0, -1.08, -0.08);
    stem.rotation.x = 0.12;
    group.add(stem);

    const cereM = new THREE.MeshPhongMaterial({
      color: 0xc9d5ef,
      transparent: true,
      opacity: 0.34,
    });
    const cereL = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 28, 20),
      cereM.clone(),
    );
    cereL.scale.set(1.0, 0.72, 0.82);
    cereL.position.set(-0.55, -0.92, -0.82);
    const cereR = cereL.clone();
    cereR.position.x = 0.55;
    group.add(cereL, cereR);

    // bentuk region risiko berdasarkan data input
    regions.forEach((reg) => {
      const geo = new THREE.SphereGeometry(1, 30, 22);
      geo.scale(reg.rx, reg.ry, reg.rz);
      const color = riskColor(reg.risk, reg.max);
      const mat = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.74,
        shininess: 80,
        emissive: color.clone().multiplyScalar(0.14),
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(reg.x, reg.y, reg.z);
      mesh.userData = {
        regionId: reg.id,
        kind: 'solid',
        region: reg,
        baseOpacity: 0.74,
        baseEmissive: color.clone().multiplyScalar(0.14),
      };
      group.add(mesh);
      interactiveMeshes.push(mesh);

      const edge = new THREE.Mesh(
        geo.clone(),
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
        }),
      );
      edge.position.copy(mesh.position);
      edge.userData = { regionId: reg.id, kind: 'wire' };
      group.add(edge);
    });

    scene.add(group);
    groupRef.current = group;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false,
      prevX = 0,
      prevY = 0;

    const focusRegion = (regionId) => {
      if (regionId) {
        const reg = regionsRef.current.find((r) => r.id === regionId);
        if (reg) setSelectedRegion(reg);
      }
      group.children.forEach((obj) => {
        if (!obj.userData?.region) return;
        const hit = obj.userData.regionId === regionId;
        if (obj.material && obj.userData.kind === 'solid') {
          obj.material.opacity = hit ? 0.98 : obj.userData.baseOpacity;
          if (obj.material.emissive)
            obj.material.emissive = hit
              ? new THREE.Color(0xffffff).multiplyScalar(0.22)
              : obj.userData.baseEmissive;
        }
        const s = hit ? 1.08 : 1.0;
        obj.scale.set(s, s, s);
      });
    };

    const updatePointer = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      dom.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      dom.style.cursor = 'grab';
    });
    dom.style.cursor = 'grab';

    dom.addEventListener('mousemove', (e) => {
      if (isDragging && group) {
        const dx = (e.clientX - prevX) * 0.008;
        const dy = (e.clientY - prevY) * 0.008;
        group.rotation.y += dx;
        group.rotation.x = Math.max(
          -0.42,
          Math.min(0.42, group.rotation.x + dy),
        );
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
      if (hit?.object?.userData?.region) {
        focusRegion(hit.object.userData.regionId);
        dom.style.cursor = 'pointer';
      } else {
        focusRegion(null);
        dom.style.cursor = 'grab';
      }
    });

    dom.addEventListener('mouseleave', () => {
      focusRegion(null);
      dom.style.cursor = 'grab';
    });

    dom.addEventListener('click', (e) => {
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
      if (hit?.object?.userData?.region) {
        setSelectedRegion(hit.object.userData.region);
      }
    });

    dom.addEventListener(
      'wheel',
      (e) => {
        camera.position.z = Math.max(
          3.4,
          Math.min(9.5, camera.position.z + e.deltaY * 0.008),
        );
        e.preventDefault();
      },
      { passive: false },
    );

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      if (!isDragging && group) group.rotation.y += 0.0022;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el || !renderer) return;
      const w = el.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', () => {});
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, [regions]);

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <ChartLabel>Visualisasi Risiko Otak 3D</ChartLabel>
      </div>

      <div
        className="relative bg-brand-200 mx-6 rounded-xl overflow-hidden"
        style={{ minHeight: 340 }}
      >
        <div ref={mountRef} className="w-full" style={{ height: 340 }} />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm text-xs text-gray-600 rounded-lg border border-white/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Drag untuk memutar · Scroll untuk zoom · Hover untuk detail area
          </span>
        </div>
      </div>

      {/* keterangan risiko */}
      <div className="flex flex-wrap gap-4 px-6 py-3 border-b border-gray-100 bg-brand-50/30">
        {[
          { color: '#2dd4a0', label: 'Risiko rendah (0–1)' },
          { color: '#fbbf24', label: 'Risiko sedang (1–2)' },
          { color: '#f97316', label: 'Risiko tinggi (2–3.5)' },
          { color: '#ef4444', label: 'Risiko sangat tinggi (>3.5)' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-6 gap-6 md:gap-0">
        {/* bagian otak */}
        <div className="md:pr-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Bagian Otak
          </p>
          <div className="space-y-1.5">
            {regions.map((reg) => {
              const hex = riskHex(reg.risk, reg.max);
              const isSelected = selectedRegion?.id === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'border shadow-md font-black scale-[1.01]'
                      : 'hover:bg-gray-100/80 border border-brand-500'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: '#2a4891',
                          backgroundColor: '#2a4891'
                        }
                      : {}
                  }
                >
                  <span className="text-sm font-medium" style={{ color: hex }}>
                    {reg.label}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: hex }}
                  >
                    {(Number(reg.risk) || 0).toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail area */}
        <div className="md:pl-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Detail Area
          </p>
          {selectedRegion ? (
            <div>
              <h4
                className="font-serif text-lg font-bold mb-1"
                style={{
                  color: riskHex(selectedRegion.risk, selectedRegion.max),
                }}
              >
                {selectedRegion.label}
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Risk score :{' '}
                <strong className="text-gray-700">
                  {(Number(selectedRegion.risk) || 0).toFixed(2)} /{' '}
                  {(Number(selectedRegion.max) || 0).toFixed(2)}
                </strong>
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(selectedRegion.variables || []).map((v) => (
                  <span
                    key={v}
                    className="px-2 py-1 bg-brand-50 border border-brand-200 text-brand-600 rounded text-xs font-mono"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div
                className="p-3 border-l-4 rounded-r-lg bg-gray-50 text-xs text-gray-600 leading-relaxed"
                style={{
                  borderColor: riskHex(selectedRegion.risk, selectedRegion.max),
                }}
              >
                {selectedRegion.explanation}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Klik salah satu label bagian otak untuk melihat detail variabel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

Brain3D.propTypes = {
  inputData: PropTypes.object,
  phqScore: PropTypes.number,
};