import express from 'express';
import { catchError } from '../../utils/catch-error';
import { getAllTeachers, getIndvTeacher, getIndvTeacherConference, getIndvTeacherEachConference, getIndvTeacherEachJournal, getIndvTeacherEachPatent, getIndvTeacherJournal, getIndvTeacherPatent } from './repository';
import { authenticateChairPerson } from '../../middleware/authenticate-user';

const Router = express.Router();

Router.get('/teachers',authenticateChairPerson, async (req, res) => {
    try {
        const teachers = await getAllTeachers();
        res.status(200).send(teachers);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:id',authenticateChairPerson, async (req, res) => {
    try {
        const id = req.params.id;
        const indvTeacherData = await getIndvTeacher(id);
        res.status(200).send(indvTeacherData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/conferences',authenticateChairPerson, async (req, res) => {
    try {
        const id = req.params.teacherId;
        const confData = await getIndvTeacherConference(id);
        res.status(200).send(confData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/conferences/:id',authenticateChairPerson,async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const id = req.params.id;
        const confData = await getIndvTeacherEachConference(teacherId,id);
        res.status(200).send(confData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/journals',authenticateChairPerson, async (req, res) => {
    try {
        const id = req.params.teacherId;
        const journalData = await getIndvTeacherJournal(id);
        res.status(200).send(journalData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/journals/:id', async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const id = req.params.id;
        const journalData = await getIndvTeacherEachJournal(teacherId, id);
        res.status(200).send(journalData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/patents', async (req, res) => {
    try {
        const id = req.params.teacherId;
        const patentData = await getIndvTeacherPatent(id);
        res.status(200).send(patentData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});


Router.get('/teachers/:teacherId/patents/:id', async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const id = req.params.id;
        const patentData = await getIndvTeacherEachPatent(teacherId,id);
        res.status(200).send(patentData);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});



export default Router;
