-- members.sql ==> FullStackWork 디렉토리 안에 저장
DROP TABLE members;

SELECT * FROM members;

CREATE TABLE members(
	id number(8) GENERATED AS IDENTITY PRIMARY KEY,
	name varchar2(50) NOT NULL,
	email varchar2(100) UNIQUE NOT NULL,
	passwd varchar2(100) NOT NULL,
	ROLE varchar2(20) DEFAULT 'USER' CHECK (ROLE IN ('USER','ADMIN')),
	refresh_token varchar2(200),
	create_at DATE DEFAULT sysdate, -- 회원가입일
	update_at DATE	
);
SELECT * FROM MY_MEMBERS;

SELECT * FROM MEMBERS ORDER BY 
id DESC;




SELECT * FROM members;


SELECT * FROM user_constraints 
WHERE table_name='MEMBERS';



SELECT 
    a.table_name AS "참조하는 테이블", 
    a.constraint_name AS "외래키 이름", 
    b.constraint_name AS "내 테이블의 PK/UK"
FROM 
    user_constraints a
JOIN 
    user_constraints b ON a.r_constraint_name = b.constraint_name
WHERE 
    b.table_name = 'MEMBERS' -- 예: 'EMP'
    AND a.constraint_type = 'R';

DROP TABLE COMMENTS;
DROP TABLE POSTS;


