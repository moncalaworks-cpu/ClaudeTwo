# Template: Django Model
# Usage: Copy and customize for your entity

from django.db import models
from django.contrib.auth.models import User


class [Model](models.Model):
    """
    [Model] model representing [description].

    Fields:
    - [field]: [description]
    """

    # Relationships
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='[models]',
        help_text='The user who owns this [model]'
    )

    # Core Fields
    # Customize these based on your requirements
    name = models.CharField(
        max_length=255,
        help_text='Name of the [model]'
    )
    description = models.TextField(
        blank=True,
        help_text='Optional description'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('archived', 'Archived'),
        ],
        default='active',
        db_index=True  # Index frequently filtered columns
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Metadata class
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = '[Models]'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.status})"

    def __repr__(self):
        return f"<[Model](id={self.id}, name={self.name})>"

    # Custom methods
    @property
    def is_active(self):
        """Check if [model] is active."""
        return self.status == 'active'

    def activate(self):
        """Activate the [model]."""
        self.status = 'active'
        self.save()

    def archive(self):
        """Archive the [model]."""
        self.status = 'archived'
        self.save()
