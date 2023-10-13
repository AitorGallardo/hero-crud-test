# Superhero SPA

This project is a technical challenge to build a Single Page Application (SPA) for superhero management using Angular and TypeScript.

## Requirements

### Development Environment

Make sure you are using the latest LTS version of Angular, TypeScript, and any libraries in this project.

### Functionality

The application should allow you to perform maintenance tasks on superheroes. To achieve this, follow these guidelines:

#### Service

1. Create a service responsible for superhero data. This service should:
   - Retrieve all superheroes.
   - Retrieve a superhero by their ID.
   - Retrieve superheroes whose names contain a specified parameter. For example, if you send "man," it should return "Spiderman," "Superman," "Manolito el fuerte," and so on.
   - Modify superhero data.
   - Delete a superhero.
   - Include unit tests for the service (optional).

#### Component

2. Create a component that interacts with the service and provides the following features:
   - Display a paginated list of heroes, including buttons for adding, editing, and deleting.
   - Show an input field above the paginated list to filter superheroes by name.
   - When the "Add" button is pressed, an empty form with suitable validations should be generated. After adding a new hero, the paginated list should be displayed again.
   - When the "Edit" button is pressed, a form with the selected hero's data should appear, allowing you to modify their information. Once edited, you should return to the paginated list.
   - When the "Delete" button is pressed, a confirmation prompt should appear. Upon confirmation, the hero should be deleted.
   - Include unit tests for the component (optional).

## Important Notes

- Superhero data should be stored within the service, and there is no need for a backend.
- Your solutions for each point, data model, and code formatting will be evaluated.
- Present your test results in a Git repository (publication not required).

## Optional Improvements

You can consider the following optional improvements to enhance your application:

- Use Angular Material for a better visual experience.
- Implement routing and page navigation.
- Dockerize the application.
- Create an interceptor to show a loading element during operations such as deletion or editing.
- Develop a directive to ensure the hero's name is always displayed in uppercase in the name text box.
- Explore the use of a mock server for simulating HTTP calls without a backend.
- Implement event-driven communication between components.

## Evaluation Criteria

Your project will be assessed based on:

- Data model construction.
- Use of reactive programming.
- Readable code using lambdas.

Good luck with your superhero maintenance SPA!
