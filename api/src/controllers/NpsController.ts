import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { Request, Response } from 'express';

class NpsController {
  /**
   * Notas 1 2 3 4 5 6 7 8 9 10
   * Detratores => 0 - 6
   * Passivos => 7 - 8
   * Promotores => 9 - 10
   *
   * Cálculo NPS:
   * (Número de promotores - número de detratores) / (número de respondentes) * 100
   */
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveysUsers.filter(
      (surveyUser) => surveyUser.value >= 0 && surveyUser.value <= 6,
    ).length;

    const promoter = surveysUsers.filter(
      (surveyUser) => surveyUser.value >= 9 && surveyUser.value <= 10,
    ).length;

    const passive = surveysUsers.filter(
      (surveyUser) => surveyUser.value >= 7 && surveyUser.value <= 8,
    ).length;

    const totalAnswers = surveysUsers.length;
    const calc = (((promoter - detractor) / totalAnswers) * 100).toFixed(2);

    return response.json({
      detractor,
      promoter,
      passive,
      totalAnswers,
      nps: calc,
    });
  }
}

export { NpsController };
