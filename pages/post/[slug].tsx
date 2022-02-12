import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'

import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}

export interface ICreateCommentForm {
  _id: string
  name: string
  email: string
  comment: string
}

function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateCommentForm>()

  const onSubmit: SubmitHandler<ICreateCommentForm> = async (data) => {
    try {
      const response = await fetch('/api/create-comment', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      console.log(await response.json())
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main>
      <Header />
      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="space-between flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Blog post by
            <span className="text-green-600"> {post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-7">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: (props: any) => (
                <li className="ml-4 list-disc">{props.children}</li>
              ),
              link: (props: any) => (
                <a className="text-blue-500 hover:underline" href={props.href}>
                  {props.children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
      >
        <p className="text-sm text-yellow-500">Enjoy this article ?</p>
        <h2 className="text-2xl font-bold"> Leave a comment below!</h2>
        <hr className="my-5 w-full  border-gray-200  p-2" />

        <input type="hidden" value={post._id} {...register('_id')} />

        <label className="mb-5 block" htmlFor="">
          <span className="text-gray-500">Name</span>
          <input
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring-yellow-400"
            type="text"
            placeholder="John Doe"
            {...register('name', { required: true })}
          />
        </label>
        <label className="mb-5 block" htmlFor="">
          <span className="text-gray-500">Email</span>
          <input
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring-yellow-400"
            type="email"
            placeholder="John Doe"
            {...register('email', { required: true })}
          />
        </label>
        <label className="mb-5 block" htmlFor="">
          <span className="text-gray-500">Comment</span>
          <textarea
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-400 focus:ring"
            rows={8}
            placeholder="John Doe"
            {...register('comment', { required: true })}
          />
        </label>

        <div className="flex flex-col p-5">
          {errors.name && <p className="text-red-500">Name is required</p>}
          {errors.email && <p className="text-red-500">Email is required</p>}
          {errors.comment && (
            <p className="text-red-500">Comment is required</p>
          )}
        </div>

        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        />
      </form>

      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-400">
        <h3>Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}</span>:{'   '}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export async function getStaticPaths() {
  const query = `
  *[_type == "post"] {
    _id,
    slug  {
      current
    }
  }
  `
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
  const query = `
  *[_type == "post" && slug.current == $slug ][0] {
    _id,
    _createdAt,
    title,
    slug,
    author -> {
      name,
      image,
    },
    description,
    mainImage,
    'comments': *[
      _type=="comment" && 
      post._ref == ^._id &&
      approved == true
    ], 
    body,
  }
  `

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return { props: { post }, revalidate: 60 }
}

export default Post
