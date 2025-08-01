Untuk Database postgreSQL bisa menjalankan query dibawah untuk connection bisa disesuaikan dengan conection di index.js. untuk data di bagian my project bisa menambahkan data melalui button add project yg ada di tampilan


CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_data BYTEA,
  github_url TEXT,
  demo_url TEXT,
  tech TEXT[],
  is_github_private BOOLEAN DEFAULT false
);

select * from projects


