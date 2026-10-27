import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";


export default function Dashboard() {
    const { loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)

    if (profileLoading || authLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <Spinner />
            </div>
        );
    }

    return (

        <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-900">
            
            <Sidebar />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">

                <div className="mx-auto w-11/12 max-w-250 py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
