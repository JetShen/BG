import '@/styles/topicPage.css';
import Topic from "@/component/topic";
import { Fragment } from "react";

const data = [
    {
        name: 'Topic 1',
        details: 'Details 1',
    },
    {
        name: 'Topic 2',
        details: 'Details 2',
    },
    {
        name: 'Topic 3',
        details: 'Details 3',
    },
    {
        name: 'Topic 4',
        details: 'Details 4',
    },
    {
        name: 'Topic 5',
        details: 'Details 5',
    },
    {
        name: 'Topic 6',
        details: 'Details 6',
    },
    {
        name: 'Topic 7',
        details: 'Details 7',
    },
    {
        name: 'Topic 8',
        details: 'Details 8',
    },
    {
        name: 'Topic 9',
        details: 'Details 9',
    },
    {
        name: 'Topic 10',
        details: 'Details 10',
    },
]


export default function Games() {
    return(
        <div className="ContainerPost">
        {data.map((topic, index) => {
            return <Topic key={index} topic={topic} />
        })}
        </div>
    )
}