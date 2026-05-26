import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { drawerWidthCollapsed } from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BubbleChat from "../components/Chat/BubbleChat";

export default function MainLayout() {
    const [sidebarWidth, setSidebarWidth] = useState(drawerWidthCollapsed);

    return (
        <>
            {/* Sidebar */}
            <Sidebar onWidthChange={setSidebarWidth} />

            {/* Main content area */}
            <Box
                sx={{
                    background:
                        "radial-gradient(circle at top right, rgba(17, 138, 178, 0.16), transparent 38%), radial-gradient(circle at bottom left, rgba(42, 157, 143, 0.14), transparent 42%), #f6f8fc",
                    minHeight: "100vh",
                    marginLeft: `${sidebarWidth}px`,
                    display: "flex",
                    flexDirection: "column",
                    transition: "margin-left 0.3s ease",
                }}
            >
                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            {/* Floating Chat Bubble */}
            <BubbleChat />
        </>
    );
}
