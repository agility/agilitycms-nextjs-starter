import React, { useEffect } from "react";
import Link from "next/link";
import { AgilityImage } from "@agility/nextjs";
import { gql } from "@apollo/client";
import client from "../../lib/apollo-client";

const PostsListing = ({ customData }) => {
  // get posts
  const posts = customData.posts;

  // // if there are no posts, display message on frontend
  if (posts.length <= 0) {
    return (
      <div className="mt-44 px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center font-bold">No posts available.</h1>
        <div className="my-10">
          <Link href={"/"}>
            <a className="px-4 py-3 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition duration-300">
              Return Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-8 mb-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link href={`/blog/${post.fields.slug}`} key={index}>
              <a>
                <div className="flex-col group mb-8 md:mb-0">
                  <div className="relative h-64">
                    <AgilityImage
                      src={post.fields.image.url}
                      alt={post.fields.image.label}
                      className="object-cover object-center rounded-t-lg"
                      layout="fill"
                    />
                  </div>
                  <div className="bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg">
                    <div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
                      {post.fields.category.fields.title}
                    </div>
                    <div className="border-b-2 border-primary-500 w-8"></div>
                    <div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
                      {new Date(post.fields.date).toLocaleDateString()}
                    </div>
                    <h2 className="text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
                      {post.fields.title}
                    </h2>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

PostsListing.getCustomInitialProps = async ({
  agility,
  channelName,
  languageCode,
}) => {
  // set up posts
  let posts;

  try {
    // fetch posts via graphql
    const { data } = await client.query({
      context: {
        headers: {
          apikey: process.env.AGILITY_API_FETCH_KEY,
        },
      },
      query: gql`
        {
          posts {
            fields {
              title
              slug
              date
              image {
                url
                label
              }
              category {
                fields {
                  title
                }
              }
            }
          }
        }
      `,
    });

    posts = data.posts;
  } catch (error) {
    if (console) console.error(error);
  }

  return {
    posts,
  };
};

export default PostsListing;
