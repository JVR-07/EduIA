import React from "react";
import { Player } from "@remotion/player";
import { EngineeringVideo } from "./video/EngineeringVideo"; // We'll move it

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">EduIA - Editor de Video</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor de Guión (Acá irá Shadcn) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Tus Datos</h2>
          <p className="text-slate-400 mb-4">Aquí puedes editar tu guión generado.</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            Generar Video (Simulado)
          </button>
        </div>

        {/* Previsualizador de Remotion */}
        <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center relative aspect-video">
          <Player
            component={EngineeringVideo}
            inputProps={{
              script: {
                title: "Ejemplo de Vista Previa",
                sections: {
                  introduccion: { text: "Hola soy la intro", duration: 5 },
                  explicacion: { text: "Esta es la explicación", duration: 5 },
                  ejemplo: { text: "Este es el ejemplo", charts: [], duration: 5 },
                  conclusion: { text: "Esta es la conclusión", duration: 5 },
                },
              },
              audioPaths: {
                introduccion: "",
                explicacion: "",
                ejemplo: "",
                conclusion: "",
              },
            }}
            durationInFrames={600}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            style={{
              width: "100%",
            }}
            controls
          />
        </div>
      </div>
    </div>
  );
}

export default App;
