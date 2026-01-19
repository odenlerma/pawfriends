// ==============================================
// PawFriends - AddPet Page
// ==============================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { useDogStore } from '../stores/dogStore'
import { ROUTES } from '../constants/routes'
import { BREED_OPTIONS, GENDER_OPTIONS, AGE_OPTIONS } from '../constants/dogBreeds'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import ImageUpload from '../components/common/ImageUpload'
import Button from '../components/common/Button'
import FormError from '../components/common/FormError'
import './AddPet.scss'

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const petSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  breed: z.string().min(1, 'Breed is required'),
  age_years: z.coerce
    .number()
    .int()
    .min(0, 'Age must be 0 or more')
    .max(30, 'Age must be 30 or less'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export default function AddPet() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { createDog, isLoading } = useDogStore()

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age_years: '',
    gender: '',
    bio: '',
  })
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleImagesChange = (newImages) => {
    setImages(newImages)
    if (errors.photos) {
      setErrors((prev) => ({ ...prev, photos: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Validate form
    const result = petSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Require at least one photo
    if (images.length === 0) {
      setErrors({ photos: 'Please add at least one photo' })
      return
    }

    try {
      // Extract files from images
      const photoFiles = images
        .filter((img) => img.isNew && img.file)
        .map((img) => img.file)

      await createDog(
        {
          owner_id: user.id,
          name: formData.name.trim(),
          breed: formData.breed,
          age_years: parseInt(formData.age_years, 10),
          gender: formData.gender,
          bio: formData.bio.trim() || null,
        },
        photoFiles
      )

      navigate(ROUTES.MY_PETS)
    } catch (error) {
      setSubmitError(error.message || 'Failed to add pet. Please try again.')
    }
  }

  return (
    <div className="add-pet">
      <div className="add-pet__container">
        {/* Header */}
        <div className="add-pet__header">
          <Link to={ROUTES.MY_PETS} className="add-pet__back">
            <ArrowLeftIcon />
            Back
          </Link>
          <h1 className="add-pet__title">Add New Pet</h1>
          <p className="add-pet__subtitle">
            Create a profile for your furry friend
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-pet__form">
          {submitError && <FormError error={submitError} />}

          {/* Photo upload */}
          <ImageUpload
            label="Photos"
            images={images}
            onImagesChange={handleImagesChange}
            maxImages={5}
            hint="Add up to 5 photos. First photo will be the main one."
            error={errors.photos}
          />

          <div className="add-pet__row">
            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your pet's name"
              error={errors.name}
              autoFocus
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              error={errors.gender}
            />
          </div>

          <div className="add-pet__row">
            <Select
              label="Breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              options={BREED_OPTIONS}
              placeholder="Select breed"
              error={errors.breed}
            />

            <Select
              label="Age"
              name="age_years"
              value={formData.age_years}
              onChange={handleChange}
              options={AGE_OPTIONS}
              placeholder="Select age"
              error={errors.age_years}
            />
          </div>

          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about your pet's personality, favorite activities, etc."
            rows={4}
            maxLength={500}
            showCount
            hint="Optional - Help other pet parents learn about your furry friend"
            error={errors.bio}
          />

          <div className="add-pet__actions">
            <Link to={ROUTES.MY_PETS}>
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
            >
              Add Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
