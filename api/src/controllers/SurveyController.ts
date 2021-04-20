import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import * as yup from 'yup';

class SurveyController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required('Título é obrigatório'),
      description: yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation failed!' });
    }

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ title, description });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async getAll(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    //SELECT * FROM SURVEYS
    const allSurveys = await surveysRepository.find();
    return response.json(allSurveys);
  }

  async deleteAllSurveys(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    // SELECT * FROM SURVEYS
    const allSurveys = await surveysRepository.find();

    // DELETE * FROM SURVEYS
    await surveysRepository.remove(allSurveys);
    return response.sendStatus(200);
  }
}

export { SurveyController };
