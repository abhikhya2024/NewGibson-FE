// SearchContext.js
import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [searchC, setSearchC] = useState("");
  const [searchAType, setSearchAType] = useState("exact");
  const [searchBType, setSearchBType] = useState("exact");
  const [searchCType, setSearchCType] = useState("exact");
  const [selectedWitness, setSelectedWitness] = useState([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  const [selectedWitnessType, setSelectedWitnessType] = useState([]);
  const [fuzzyTranscripts, setFuzzyTranscripts] = useState([])
  const [fuzzyWitnesses, setFuzzyWitnesses] = useState([])

  return (
    <SearchContext.Provider
      value={{
        searchA,
        setSearchA,
        searchB,
        setSearchB,
        searchC,
        setSearchC,
        searchAType,
        setSearchAType,
        searchBType,
        setSearchBType,
        searchCType,
        setSearchCType,
        selectedWitness,
        setSelectedWitness,
        selectedTranscripts,
        setSelectedTranscripts,
        selectedWitnessType,
        setSelectedWitnessType,
        fuzzyTranscripts,
        setFuzzyTranscripts,
        fuzzyWitnesses,
        setFuzzyWitnesses
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
