import React from "react";
import { Composition } from "remotion";
import { EngineeringVideo } from "./EngineeringVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="EngineeringVideo"
      component={EngineeringVideo as unknown as React.ComponentType<Record<string, unknown>>}
      durationInFrames={900}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        script: {
          title: "Título del tema",
          sections: {
            introduccion: { text: "", duration: 10 },
            explicacion: { text: "", duration: 15 },
            ejemplo: { text: "", charts: [], duration: 15 },
            conclusion: { text: "", duration: 8 },
          },
        },
        audioPaths: {
          introduccion: "",
          explicacion: "",
          ejemplo: "",
          conclusion: "",
        },
      }}
    />
  );
};