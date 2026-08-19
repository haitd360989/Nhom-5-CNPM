import pytest
from pydantic import ValidationError

from app.diagnostic_schemas.diagnostic import StudyPlanInitRequest
from app.models import StudyPlan


def test_study_plan_target_score_column_supports_1200():
    column_type = StudyPlan.__table__.c.target_score.type

    assert column_type.precision == 7
    assert column_type.scale == 2


def test_study_plan_target_score_accepts_business_range():
    assert StudyPlanInitRequest(target_score=1).target_score == 1
    assert StudyPlanInitRequest(target_score=1200).target_score == 1200


@pytest.mark.parametrize("target_score", [0, 1200.01])
def test_study_plan_target_score_rejects_out_of_range_values(target_score):
    with pytest.raises(ValidationError):
        StudyPlanInitRequest(target_score=target_score)
