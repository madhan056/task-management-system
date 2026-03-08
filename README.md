# Task Management System

## Project Overview

This project is a **full-stack Task Management System** designed to help users organize, track, and manage tasks efficiently. The system allows users to **create, update, delete, and monitor tasks** along with their status, priority, and deadlines.

The backend is built using **Django REST Framework**, which provides RESTful APIs for task operations, while the frontend is developed using **React.js** to deliver an interactive and responsive user interface. Task data is stored in a **SQLite database** and dynamically displayed on

## Technologies Used

### Backend
-   Python
-   Django
-   Django REST Framework
-   SQLite

### Frontend
-   React.js
-   JavaScript
-   HTML
-   CSS

# Installation & Setup

## Clone the Repository

``` bash
git clone https://github.com/yourusername/task-management-system.git
```

# Backend Setup

### Navigate to Backend Folder

``` bash
cd Backend
```

### Install Dependencies

``` bash
pip install -r requirements.txt
```

### Run Database Migrations

``` bash
python manage.py migrate
```

### Start Django Server

``` bash
python manage.py runserver
```

Backend will run at:    http://127.0.0.1:8000

# Frontend Setup

### Navigate to Frontend Folder

``` bash
cd Frontend
```

### Install Dependencies

``` bash
npm install
```

### Start React Development Server

``` bash
npm start
```

Frontend will run at:   http://localhost:3000