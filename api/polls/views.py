from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.serializers import ValidationError

from .models import Question, Choice
from .serializers import QuestionSerializer, ChoiceSerializer, VoteSerializer


class PollView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    @action(methods=['post'], detail=False, permission_classes=[AllowAny], serializer_class=VoteSerializer)
    def vote(self, request):
        try:
            vote_serializer = self.get_serializer(data=request.data)
            vote_serializer.is_valid(raise_exception=True)
            choice = vote_serializer.save()
            choice_serializer = ChoiceSerializer(choice)
            return Response(choice_serializer.data, status=status.HTTP_200_OK)
        except Choice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except ValidationError as exp:
            return Response(exp.detail, status=exp.status_code)
