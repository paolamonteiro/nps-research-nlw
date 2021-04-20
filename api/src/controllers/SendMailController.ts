import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { resolve } from 'path';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('User does not exist!');
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      throw new AppError('Survey does not exist!');
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL,
    };

    if (surveyUserAlreadyExist) {
      variables.id = surveyUserAlreadyExist.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExist);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    variables.id = surveyUser.id;
    await surveysUsersRepository.save(surveyUser);
    await SendMailService.execute(email, survey.title, variables, npsPath);
    return response.json(surveyUser);
  }

  async getAll(request: Request, response: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const allSurveysUsers = await surveysUsersRepository.find();
    return response.json(allSurveysUsers);
  }

  async deleteAllUsersSurveys(request: Request, response: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const allUsersSurveys = await surveysUsersRepository.find();

    await surveysUsersRepository.remove(allUsersSurveys);
    return response.sendStatus(200);
  }
}

export { SendMailController };
