from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

class FlaskTests(TestCase):

    def test_show_board(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1>THIS IS MY BOGGLE!!!</h1>', html)

    def test_check_word(self):
        with app.test_client() as client:
            res = client.get('/')
            res = client.get('/check-word?word=kjhgf')
            self.assertEqual(res.json['result'], 'not-word')

    def test_session_count(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['nplays'] = 10

            res = client.get('/')
            self.assertEqual(res.status_code, 200)
            self.assertEqual(session['nplays'], 10)