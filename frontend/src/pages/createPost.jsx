import React from "react";
import Layout from "../pages/Layout";
import CreatePostForm from "../components/createPostForm";

const CreatePost = () => {
  return (
    <Layout>
      <div className="flex justify-center h-full items-center">
        <CreatePostForm />
      </div>
    </Layout>
  );
};

export default CreatePost;
