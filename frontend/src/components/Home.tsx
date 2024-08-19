import { useState } from "react";
import SidePanel from "./SidePanel";
import ResearchAddOption from "./Research/ResearchAddOption";
import ResearchAnalyzeOption from "./Research/ResearchAnalyzeOption";
// import DaAddOption from "./Department-Activity/DA_AddOptions";
// import DaAnalyzeOption from "./Department-Activity/DA_AnalyzeOptions";
// import SaAddOption from "./Student-Activity/SA_AddOption";
// import SaAnalyzeOption from "./Student-Activity/SA_AnalyzeOption";

export default function Home() {
    const [index, setIndex] = useState(0);
    const elementList = [
        <ResearchAddOption key="0" />,
        <ResearchAnalyzeOption key="1" />,
        // <DaAddOption key="2" />,
        // <DaAnalyzeOption key="3" />,
        // <SaAddOption key="4" />,
        // <SaAnalyzeOption key="5" />,
    ];

    return (
        <div className="overflow-x-hidden">
            <SidePanel index={index} setIndex={setIndex} />
            {elementList[index]}
        </div>
    );
}
