import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { ThemeContext } from "@/context/ThemeContext";
import { useGetRecentPosts, useGetUsers } from "@/lib/react_query/queries";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {dark}=useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(()=> {
    //logic for getting a value from local storage stored under the key 'key'
    const data = localStorage.getItem('cookieFallback')
    if (!data ) navigate('/sign-in')
  },[])

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);


  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[100vh] overflow-auto">
      <div className={`home-container ${!dark?"custom-scrollbar":""}`}>
        <div className="home-posts">
          <h2 className={`${!dark?"text-white":"text-primary-500"} h3-bold md:h2-bold text-left w-full`}>Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className={`h3-bold ${!dark?"text-light-1":"text-primary-500"}`}>Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;