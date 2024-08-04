# Allobrain notes

The current project is to create a web APP to manage peronal notes, each note is versioned.

The current Repository contains two projects:

- api: implemented with FastAPI
- ui: implemented with ReactJS


## Get started

I provide a docker compose file to launch all services, run the following command in your terminal:

```bash
docker compose up -d
```

It will launch three services:

- db: the database
- api: the API service
- ui: the front-end


Then open your navigator with the url: [http://localhost:8080](http://localhost:8080), 
before playing with your notes, you'll need to create a new account first. 


**NB**: As this is a homework project, and authentication is not part of the subject, I didn't implement the forget password feature. 


## More

The get started section provide a way to launch the APP with docker compose, if you want to launch API and UI without docker, 
please refer to following links:

- [API](./api/README.md)
- [UI](./ui/README.md)


## TODO

* Forget password
* Pagination of the notes
* Add tooltips to the following buttons:
    * show history button
    * revert to a specific version
* Add support for database migrations.
* Better error message on the UI side.
* Support markdown for the note content.
* Other improvements on the UI


