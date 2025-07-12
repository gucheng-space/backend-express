/**
 * 查询片段
 */
export const sqlFragment = {
  user: `
    (SELECT JSONB_BUILD_OBJECT(
      'id', "user".id,
      'username', "user".name,
      'avatar', CASE WHEN COUNT(avatar.id) > 0 THEN 1 ELSE NULL END
      )
    FROM "user"
    LEFT JOIN avatar ON avatar.userid = "user".id
    WHERE "user".id = post.userid
    GROUP BY "user".id, "user".name
    ) AS user
  `,
  totalComments: `
    (SELECT 
      COUNT("comment".id)
    FROM 
      "comment"
    WHERE
      "comment".postid = post.id
    ) AS totalComments
  `,
  files: `
    COALESCE(
      (SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
              'id', file.id,
              'width', file.width,
              'height', file.height
          )
      ) 
      FROM (
          SELECT id, width, height 
          FROM file 
          WHERE postid = post.id 
          ORDER BY id DESC
      ) file),
      '[]'::JSONB
    ) AS files 
  `,
  tags: `
    COALESCE(
      (
        SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', tag.id,
            'name', tag.name
          )
        )
        FROM post_tag
        JOIN tag ON post_tag.tagid = tag.id
        WHERE post_tag.postid = post.id
      ),
      '[]'::JSONB
    ) AS tags
  `,
};
