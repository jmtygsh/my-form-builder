import * as React from 'react'

import {
    useRive,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";

const Animate = () => {


    const { RiveComponent, rive } = useRive({
        src: "/riv/hero-home.riv",
        autoplay: true,
        stateMachines: "state_home-hero",
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.BottomCenter,
        }),

    });

    // Debugging tool to find the correct state machine name and inputs
    // React.useEffect(() => {
    //     if (rive) {
    //         console.log("Available State Machines:", rive.stateMachineNames);
    //         const inputs = rive.stateMachineInputs("state_home-hero");
    //         console.log("Available Inputs for state_home-hero:", inputs);
    //     }
    // }, [rive]);


    return (
        <RiveComponent className="w-full h-full" />
    )
}

export default Animate