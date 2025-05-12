import { IBlog, ICategoryAndTags } from '@/types'
import request, { gql } from 'graphql-request'
import { cache } from 'react'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!

export const getCategories = async () => {
	const query = gql`
		query MyQuery {
			categories {
				name
				slug
				blogs {
					... on Blog {
						id
					}
				}
			}
		}
	`

	const { categories } = await request<{ categories: ICategoryAndTags[] }>(
		graphqlAPI,
		query
	)
	return categories
}

export const getBlogsByCategory = cache(async (slug: string) => {
	const query = gql`
		query MyQuery($slug: String!) {
			category(where: { slug: $slug }) {
				blogs {
					... on Blog {
						id
						author {
							... on Author {
								id
								name
								image {
									url
								}
								bio
							}
						}
						content {
							html
						}
						createdAt
						image {
							url
						}
						slug
						tag {
							name
							slug
						}
						category {
							name
							slug
						}
						description
						title
					}
				}
				name
			}
		}
	`

	const { category } = await request<{
		category: { blogs: IBlog[]; name: string }
	}>(graphqlAPI, query, { slug })
	return category
})
