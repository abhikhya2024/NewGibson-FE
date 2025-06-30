import { createContext, useState } from "react";

// 👤 Witness Context
export const WitnessContext = createContext();

// 📄 Transcript Context
export const TranscriptContext = createContext();

export const ContextProvider = ({ children }) => {
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);

  return (
    <WitnessContext.Provider value={{ selectedWitnesses, setSelectedWitnesses }}>
      <TranscriptContext.Provider value={{ selectedTranscripts, setSelectedTranscripts }}>
        {children}
      </TranscriptContext.Provider>
    </WitnessContext.Provider>
  );
};
