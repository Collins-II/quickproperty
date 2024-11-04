"use client";

import { store } from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

interface Props {
    children: ReactNode;
}

const ReduxProvider = (props: Props) => {
    return <Provider store={store}>{props.children}</Provider>;
}

export default ReduxProvider