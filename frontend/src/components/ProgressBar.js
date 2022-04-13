import React, { useEffect, useState } from "react";

function classNames(currClasses, newClass) {
    return `${currClasses} ${newClass}`;
}

const ProgressBar = (props) => {
    const [percent, setPercent] = useState("");
    const { value, lowerBound, upperBound } = props;

    useEffect(() => {
        const lower = parseFloat(lowerBound);
        const upper = parseFloat(upperBound);
        const ratio = (value - lower) / (upper - lower);

        let correctWidth = 1/12;
        let smallestDiff = 1000;
        const possibleWidths = [{"1/12": 1/12}, {"2/12": 2/12}, {"3/12": 3/12}, {"4/12": 4/12}, {"5/12": 5/12},
            {"6/12": 6/12}, {"7/12": 7/12}, {"8/12": 8/12}, {"9/12": 9/12}, {"10/12": 10/12}, {"11/12": 11/12}, {"12/12": 1}];

        possibleWidths.forEach((width) => {
            const widthStr = Object.keys(width)[0];
            const widthNum = width[widthStr];
            if (Math.abs(parseFloat(widthNum) - ratio) < smallestDiff) {
                correctWidth = widthStr;
                smallestDiff = Math.abs(parseFloat(widthNum) - ratio);
            }
        });
        console.log(correctWidth)
        setPercent(`w-${correctWidth}`)
    }, [lowerBound, upperBound, value])

    return (
        <div className="flex h-4 w-full bg-gray-300 rounded-lg flex flex-col text-sm font-bold">
            <div className={classNames("h-full rounded-lg bg-blue-500 p-2", percent)} />
            <div className="flex justify-between items-center">
                <p>{lowerBound}</p>
                <p>{upperBound}</p>
            </div>
        </div>
    );
};

export default ProgressBar;