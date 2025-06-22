import { createContext, useContext } from "react";
import { getMyProfile, IBookMark } from "./http";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
export interface IProfileData {
  _id: string;
  id: string;
  displayName: string;
  emails?: string | null;
  photos?: string;
  posts: IBookMark[];
  topics?: string[];
}
export type IPost = IBookMark;
export const ProfileDataContext = createContext<IProfileData | null>(null);
export function UserProfileData({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await getMyProfile(navigate);
      return profile as IProfileData;
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching profile data.</div>;
  return (
    <ProfileDataContext.Provider value={data || null}>
      {children}
    </ProfileDataContext.Provider>
  );
}
export function useProfileData() {
  const profile = useContext(ProfileDataContext);
  if (profile === undefined) {
    throw new Error("DashboardContex is used outside the DashboardProvider");
  }
  return profile;
}
