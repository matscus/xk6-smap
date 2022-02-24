package smap

import (
	"sync"

	log "github.com/sirupsen/logrus"
	"go.k6.io/k6/js/modules"
)

func init() {
	modules.Register("k6/x/smap", new(SMap))
}

type SMap struct{}

type Client struct {
	ch chan interface{}
	mp *sync.Map
}

func (SMap) New() *Client {
	res := Client{
		mp: new(sync.Map),
	}
	return &res
}

func (s *Client) Store(k interface{}, v interface{}) {
	s.mp.Store(k, v)
}

func (s *Client) Load(k interface{}) (interface{}, bool) {
	return s.mp.Load(k)
}

func (s *Client) Delete(k interface{}) {
	s.mp.Delete(k)
}

func (s *Client) LoadAndDelete(k interface{}) (interface{}, bool) {
	return s.mp.LoadAndDelete(k)
}

func (s *Client) LoadOrStore(k interface{}, v interface{}) (interface{}, bool) {
	return s.mp.LoadOrStore(k, v)
}

func (s *Client) InitSequential(len int) {
	s.ch = make(chan interface{}, len)
	go worker(s)
}

func (s *Client) Len() int {
	l := 0
	s.mp.Range(func(key, value interface{}) bool {
		l++
		return true
	})
	return l
}

func (s *Client) Sequential() interface{} {
	return <-s.ch
}

func worker(s *Client) {
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
