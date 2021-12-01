from django.db.models import F
from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField

from .models import Question, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'choice_text', 'votes')


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'question_text', 'pub_date', 'choices')


class VoteSerializer(serializers.Serializer):
    choice = PrimaryKeyRelatedField(many=False, queryset=Choice.objects.all())

    def create(self, validated_data):
        choice_instance = validated_data.pop('choice')
        choice_instance.votes = F('votes') + 1
        choice_instance.save()
        return Choice.objects.get(pk=choice_instance.pk)

    def update(self, instance, validated_data):
        raise NotImplementedError()
