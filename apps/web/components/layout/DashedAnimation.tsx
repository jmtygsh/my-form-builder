import * as React from 'react'

import {
    useRive,
    useStateMachineInput,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";

const DashedAnimation = () => {

    const { RiveComponent, rive } = useRive({
        src: "/riv/dashed.riv",
        autoplay: true,
        stateMachines: "state_input_draw-dash",
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    // Get the input from the state machine
    const scrollInput = useStateMachineInput(rive, "state_input_draw-dash", "input-scroll");

    // Debugging and setting the initial value
    React.useEffect(() => {
        if (rive && scrollInput) {
            console.log("Setting input-scroll to 50");
            scrollInput.value = 99; // You can change this number to test different states
        }
    }, [rive, scrollInput]);

    return (
        <div className="w-full h-32 sm:h-64 relative">
            <RiveComponent className="w-full h-full" />
        </div>
    )
}

export default DashedAnimation
