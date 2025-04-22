import React from "react";
import dynamic from "next/dynamic";

// Dynamically import SavedView to prevent SSR issues with window.localStorage
const SavedView = dynamic(() => import("../../src/pages/SavedAnalyses"), {
  ssr: false,
});

export default function SavedPage() {
  return <SavedView />;
}
