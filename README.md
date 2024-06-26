## Details of the Project

This is a full stack web app that allows users to upload their W-2 forms (or
even other PDF's) and interact with an AI that can help them understand the
document and look for whatever they need within the PDF.

## Details about the major Technologies, Languages, Frameworks & Dependencies used

Majorly these are the technologies used, for a more in depth look you can look
into the package.json file:

- Next.js for the FE & BE servers.
- React
- TypeScript
- Tailwind CSS
- Clerk for Authentication
- Drizzle ORM
- PostgreSQL on Neon.Tech
- AWS S3 & AWS SDK
- OpenAI API
- Pinecone for Vector Database
- Drizzle-kit
- OpenAI Edge
- ESLint
- PDFParse to parse pdfs
- ShadCN
- Radix as a UI Library

Open Source Repository Used:

The repository that I forked from is the only open spurce repository I used. It
is a rejected PR of another repository that has lots of deprecated dependencies.
The PR had made some good progress within it but was not functional and mostly
used deprecated libraries. I fixed the issues and brought it up to date and up
to speed for this coding challenge.

Link to forked repository: https://github.com/rkf2778/chatpdf .

Deployment Tools used:

Vercel was used to deploy this as it is the easiest tool to use for deployments
of NextJs Apps.

AI Coding Assistants used:

ChatGPT

## Objectives met

All of the main requirements of this coding assignment were met (Only the
backend was not built in Django but that was a preference & basic initilization
scripts could not be added as I require authentication through google), along
with some off of the wishlist.

Listing the wishlist objectives I met for your ease:

- Enhanced UI/UX design: Tried my best to make the FE as pretty and smooth as I
  could.
- Show social security number after the text confirmation: The AI will ask you
  to confirm if you wish to see the social security number before revealing it.
- Implementation of security measures such as file encryption and user
  authentication: I have added User Auth using clerk.
- The Docker setup is configured for both development and production
  environments: In the docker compose file you can change the environment value
  between development and production and based on that the dockefile will run
  certain commands.
- Use of a vector database and integration of a knowledge graph for advanced
  data handling: I have used Pinecone DB as a vector database.

## Getting Started

(This is mostly copied over from the original authors Github as my process is
equivalent)

You need to follow through and make accounts and get the keys for all relevant
services as below, instead of running using

```Bash
npm run dev
```

you could alternatively use

```Bash
docker-compose up
```

as was required.

1. Clone the repo and navigate to 'chatpdf' :

```Bash
git clone repo-link
cd chatpdf
```

- Change following configuration for windows and Mac OS:

  - In "dev" script change between "set" and "export" based on the type of OS.

  - For windows :
    ```
    "scripts": {
       "dev": "set NODE_OPTIONS='--max-old-space-size=8192' && next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "format": "prettier --check --ignore-path .gitignore .",
       "format:fix": "prettier --write --ignore-path .gitignore ."
    },
    ```
  - For Mac:
    ```
    "scripts": {
       "dev": "export NODE_OPTIONS='--max-old-space-size=8192' && next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "format": "prettier --check --ignore-path .gitignore .",
       "format:fix": "prettier --write --ignore-path .gitignore ."
    },
    ```

2. **Install the dependencies** : Requires
   **[Node.js](https://nodejs.org/en/download/)** to be installed

```Bash
npm install
```

3.  **Setup Clerk**

- Create an account in [here](https://clerk.com/)
- Copy the keys displayed and paste it into the .env file :

```Bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= paste_key_here
  CLERK_SECRET_KEY= paste_key_here
```

4.  **NEON DB** (To get DATABASE_URL for .env file)

- Create an account [here](https://neon.tech/)
- Create a project
- Copy the URL shown and paste it into `DATABASE_URL` in .env file

```Bash
  DATABASE_URL = paste_key_here
```

5.  **Drizzle ORM** is edge compatible. Hence we use this instead of Prisma.
    `Plus it's faster than Prisma.`

- Push the DB to drizzle with drizzle-kit
- pg in below command stands for PostgreSQL

```Bash
  npx drizzle-kit push:pg
```

- Open Drizzle-kit studio

```Bash
  npx drizzle-kit studio
```

6. **Amazon S3 Bucket**

- Go to [Amazon S3 bucket](https://aws.amazon.com/s3/) and create a new bucket
- Give a unique bucket name
- Uncheck **_"Block Public Access settings for this bucket"_**
- Click on the acknowledge checkbox
- Click "Create Bucket"
- Go to that bucket
- Click "Permissions" tab
- Go down to "Bucket Policy" and click edit and write below :

```Bash
      {
      "Version": "2012-10-17",
      "Statement": [{
          "Sid": "Statement1",
          "Principal": "*",
          "Effect": "Allow",
          "Action": [
            "s3:GetObject"
          ],
          "Resource": ["arn:aws:s3::::chatpdfsaas/*"]
        }]
      }
```

- For `"Resource": ["arn:aws:s3::::bucketname/*"]` you have to replace
  `bucketname` and enter your bucket name instead.
- Press **"Save Changes"**
- Go down to `Cross-origin resource sharing (CORS)` and type :

```JavaScript
  [
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE",
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

- Click "Save changes"
- How to get the API Keys:

  - Search for "IAM" > Users > Click "Create user"
  - Enter name of user > Click Next
  - Permission Options : Set to "Attach policies directly"
  - Under permission policies, add the following policies: `AmazonS3FullAccess`
  - Click Next > Click `Create User`
  - Click the user you created
  - `Security Credentials` tab
  - Click "Create Access Key``
  - Select "Local Code" as use case
  - Click Next > Click Create Access Key
  - Add the following to your `.env` file

  ```Bash
  NEXT_PUBLIC_S3_BUCKET_NAME = your_bucket_name
  NEXT_PUBLIC_S3_ACCESS_KEY_ID = your_access_key
  NEXT_PUBLIC_S3_SECRET_ACCESS_KEY = your_secret_access_key
  ```

  - Change `region` in the file `s3.ts` to the region you have set for your
    bucket as below example

  ```JavaScript
  const s3 = new S3({
        region: "ap-southeast-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });
  ```

  - Also change the region (example `ap-southeast-1`) in the last line of the
    file

  ```JavaScript
    export function getS3Url(file_key: string) {
      const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`
      return url
    }
  ```

7. **Pinecone DB Setup**

- Go to [Pinecone](https://www.pinecone.io/) > Create an account
- Create new project > Create a new Index
  - Configure your Index
    - Dimensions : 1536
  - Click `Create Index`
- Create API Key and paste keys in `.env` file:
  - _PINECONE_ENVIRONMENT value is of the format REGION-ENVIRONMENT_

```Bash
PINECONE_INDEX_NAME=your_index_name
PINECONE_ENVIRONMENT=us-central1-gcp-starter
PINECONE_API_KEY=your_api_key
```

- Find the code as shown below in the files `src\lib\pinecone.ts` and
  `src\lib\context.ts` and enter your `Index Name` :

```Javascript
const pineconeIndex = await client.index('your_index_name')
```

8. **OPENAI API**

- Go to [OpenAI API](https://openai.com/blog/openai-api)
- Menu > API > Overview
- Click `For Developers` > `Embeddings`
- Login if not yet done
- Go to `API Keys` and create a new Secret Key
- Copy and paste API key into `.env` file

```Bash
OPENAI_API_KEY=your_api_key
```

10. That was a lot of work, go ahead and run the project now by either running

`````Bash
npm run dev
```


or alternatively

````Bash
docker-compose up
```

`````
