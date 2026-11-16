from typing import Annotated

from fastapi import Depends, Request
from sklearn.pipeline import Pipeline


def get_pipeline(request: Request) -> Pipeline:
    return request.app.state.pipeline


PipelineDep = Annotated[Pipeline, Depends(get_pipeline)]
