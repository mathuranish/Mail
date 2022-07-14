# Mail
A simple mailing site.

Live:
https://mail-django-app.herokuapp.com/

## Setup
Requires Python3 and the package installer for Python (pip) to run:


Clone this repository:
`git clone https://github.com/mathuranish/Mail`


* Install requirements: `pip install -r requirements.txt`
* After cloning the repository, refer to the project folder and:
  1. Create new migrations based on the changes in models: `python3 manage.py makemigrations`
  2. Apply the migrations to the database: `python3 manage.py migrate`
  3. Create a superuser to be able to use Django Admin Interface: `python3 manage.py createsuperuser`
  4. Run the app locally: `python3 manage.py runserver`
  5. Visit the site: `http://localhost:8000`
  6. Enjoy!
