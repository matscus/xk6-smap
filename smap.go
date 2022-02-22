package smap

import (
	"sync"

	log "github.com/sirupsen/logrus"
	"go.k6.io/k6/js/modules"
)

func init() {
	modules.Register("k6/x/smap", New())
}

type SMap struct {
	ch chan interface{}
	mp *sync.Map
}

func New() *SMap {
	res := &SMap{
		mp: new(sync.Map),
	}
	return res
}

func (s *SMap) Store(k interface{}, v interface{}) {
	s.mp.Store(k, v)
}

func (s *SMap) Load(k interface{}) (interface{}, bool) {
	return s.mp.Load(k)
}

func (s *SMap) Delete(k interface{}) {
	s.mp.Delete(k)
}

func (s *SMap) LoadAndDelete(k interface{}) (interface{}, bool) {
	return s.mp.LoadAndDelete(k)
}

func (s *SMap) LoadOrStore(k interface{}, v interface{}) (interface{}, bool) {
	return s.mp.LoadOrStore(k, v)
}

func (s *SMap) InitSequential(len int) {
	s.ch = make(chan interface{}, len)
	go worker(s)
}

func (s *SMap) Sequential() interface{} {
	return <-s.ch
}

func worker(s *SMap) {
	var l = 0
	defer func() {
		if err := recover(); err != nil {
			log.Error("Worker recover panic ", err)
		}
		go worker(s)
	}()
	for {
		s.mp.Range(func(k, v interface{}) bool {
			if len(s.ch) <= l {
				s.ch <- v
			}
			l++
			return true
		})
		l = 0
	}
}
