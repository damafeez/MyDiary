import express from 'express';
import Diary from '../models/Diary';
import { filterRequired } from '../helpers/utils';

export async function postEntry(req, res) {
  const requiredFields = ['title', 'body', 'author'];
  try {
    const { title, body, author } = req.body;
    if (title && body && author) {
      const newDiary = new Diary({ title, body, author });
      const diary = await Diary.save(newDiary);
      res.json({
        body: diary,
        error: null,
      });
    } else {
      const error = filterRequired(requiredFields, req.body);
      throw new Error(error);
    }
  } catch (error) {
    res.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
export async function getEntries(req, res) {
  try {
    const entries = await Diary.find();
    res.json({
      body: entries,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      body: {},
      error: error.message,
    });
  }
}
export async function getEntry(req, res) {
  try {
    const { id } = req.params;
    const entry = await Diary.findById(id);
    res.json({
      body: entry,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      body: {},
      error: error.message,
    });
  }
}
export async function editEntry(req, res) {
  try {
    const { title, body } = req.body;
    if (title && body) {
      const diary = await Diary.findByIdAndUpdate(req.params.id, { title, body });
      res.json({
        body: diary,
        error: null,
      });
    } else {
      throw new Error('all fields must be provided');
    }
  } catch (error) {
    res.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const diary = await Diary.findByIdAndDelete(id);
    res.json({
      body: diary,
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
