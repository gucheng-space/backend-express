/**
 * SQL 查询片段
 */
export const sqlFragment = {
  leftJoinUser: `
    LEFT JOIN "user"
        ON "user".id = "comment".userid
  `,
  user: `
    JSONB_BUILD_OBJECT(
        'id', "user".id,
        'name', "user".name,
        'avatar', CASE WHEN EXISTS (SELECT 1 FROM avatar a WHERE a.userid = "user".id) THEN 1 ELSE NULL END
    ) AS user
  `,
  leftJoinPost: `
    LEFT JOIN "post"
        ON "post".id = "comment".postid
  `,
  post: `
    JSONB_BUILD_OBJECT(
        'id', "post".id,
        'title', "post".title
    ) AS post
  `,
  repliedComment: `
    (
      SELECT 
        JSONB_BUILD_OBJECT(
          'id',repliedComment.id,
          'content',repliedComment.content
        )
      FROM 
        comment repliedComment
      WHERE
        comment.parentid = repliedComment.id
    )AS repliedComment
  `,
  totalReplies: `
    (
      SELECT 
        COUNT(reply.id)
      FROM 
        comment reply
      WHERE
        reply.parentid = comment.id
    ) AS totalReplies
  `,
};
